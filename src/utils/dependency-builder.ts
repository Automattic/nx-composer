import {
	ProjectConfiguration,
	ProjectGraph,
	ProjectGraphBuilder,
	Workspace,
} from '@nrwl/devkit';
import { existsSync } from 'fs';
import { join } from 'path';
import { ComposerConfig } from './composer-config';

type ProjectConfigurationMap = {
	[ projectName: string ]: ProjectConfiguration;
};

/**
 * A class for building project dependencies for Composer projects.
 */
export class DependencyBuilder {
	/**
	 * All of the projects that we're managing dependencies for.
	 */
	private readonly projects: ProjectConfigurationMap;

	/**
	 * Constructor.
	 *
	 * @param {Workspace} workspace The workspace we're building dependencies for.
	 */
	public constructor( workspace: Workspace ) {
		this.projects = workspace.projects;
	}

	/**
	 * Adds all of the Composer dependencies for the projects to the graph.
	 *
	 * @param {ProjectGraph} graph The graph we want to add dependencies to.
	 */
	public addDependencies( graph: ProjectGraph ): ProjectGraph {
		const graphBuilder = new ProjectGraphBuilder( graph );

		for ( const projectName in this.projects ) {
			this.addProjectDependencies(
				graphBuilder,
				projectName,
				this.projects[ projectName ]
			);
		}

		return graphBuilder.getUpdatedProjectGraph();
	}

	/**
	 * Adds all of the dependencies for a project.
	 *
	 * @param {ProjectGraphBuilder}  graphBuilder The builder for the project graph we're constructing.
	 * @param {string}               projectName  The name of the project.
	 * @param {ProjectConfiguration} project      The project we're fetching dependencies for.
	 */
	private addProjectDependencies(
		graphBuilder: ProjectGraphBuilder,
		projectName: string,
		project: ProjectConfiguration
	): void {
		// We can read the dependencies from the `composer.json` file, if there is one.
		const composerPath = join( project.root, 'composer.json' );
		if ( ! existsSync( composerPath ) ) {
			return;
		}

		const config = new ComposerConfig( composerPath );
		if ( config.getName() !== projectName ) {
			return;
		}

		// Keep track of the composer dependencies that are associated with a project.
		const composerDependencies = config.getDependencies();
		for ( const dependencyName of composerDependencies ) {
			if ( ! this.projects[ dependencyName ] ) {
				continue;
			}

			graphBuilder.addExplicitDependency(
				projectName,
				composerPath,
				dependencyName
			);
		}
	}
}
