import {
	ProjectConfiguration,
	ProjectGraph,
	ProjectGraphBuilder,
} from '@nrwl/devkit';
import { join } from 'path';
import { DependencyBuilder } from '../dependency-builder';

describe( 'DependencyBuilder', () => {
	const workspaceDir = join( __dirname, '..', '..', '..', 'test-workspace' );
	const projects: { [ projectName: string ]: ProjectConfiguration } = {
		'nx-composer/package-a': {
			root: join( workspaceDir, 'package-a' ),
			targets: {},
		},
		'nx-composer/package-b': {
			root: join( workspaceDir, 'package-b' ),
			targets: {},
		},
	};
	let projectGraph: ProjectGraph;

	beforeAll( () => {
		const builder = new ProjectGraphBuilder();
		builder.addNode( {
			type: 'library',
			name: 'nx-composer/package-a',
			data: {
				root: projects[ 'nx-composer/package-a' ].root,
				files: [
					{
						file: join(
							projects[ 'nx-composer/package-a' ].root,
							'composer.json'
						),
						hash: '12345',
					},
				],
			},
		} );
		builder.addNode( {
			type: 'library',
			name: 'nx-composer/package-b',
			data: {
				root: projects[ 'nx-composer/package-b' ].root,
				files: [
					{
						file: join(
							projects[ 'nx-composer/package-b' ].root,
							'composer.json'
						),
						hash: '12345',
					},
				],
			},
		} );
		projectGraph = builder.getUpdatedProjectGraph();
	} );

	it( 'should add composer dependencies', () => {
		const builder = new DependencyBuilder( {
			version: 1,
			npmScope: 'nx-composer',
			projects,
		} );

		const newGraph = builder.addDependencies( projectGraph );

		expect( newGraph.dependencies ).toEqual( {
			'nx-composer/package-a': [
				{
					source: 'nx-composer/package-a',
					target: 'nx-composer/package-b',
					type: 'static',
				},
			],
			'nx-composer/package-b': [],
		} );
	} );
} );
