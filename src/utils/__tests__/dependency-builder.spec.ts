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
		'nx-php/package-a': {
			root: join( workspaceDir, 'package-a' ),
			targets: {},
		},
		'nx-php/package-b': {
			root: join( workspaceDir, 'package-b' ),
			targets: {},
		},
	};
	let projectGraph: ProjectGraph;

	beforeEach( () => {
		const builder = new ProjectGraphBuilder();
		builder.addNode( {
			type: 'library',
			name: 'nx-php/package-a',
			data: {
				root: projects[ 'nx-php/package-a' ].root,
				files: [
					{
						file: join(
							projects[ 'nx-php/package-a' ].root,
							'composer.json'
						),
						hash: '12345',
					},
				],
			},
		} );
		builder.addNode( {
			type: 'library',
			name: 'nx-php/package-b',
			data: {
				root: projects[ 'nx-php/package-b' ].root,
				files: [
					{
						file: join(
							projects[ 'nx-php/package-b' ].root,
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
			npmScope: 'nx-php',
			projects,
		} );

		const newGraph = builder.addDependencies( projectGraph );

		expect( newGraph.dependencies ).toEqual( {
			'nx-php/package-a': [
				{
					source: 'nx-php/package-a',
					target: 'nx-php/package-b',
					type: 'static',
				},
			],
			'nx-php/package-b': [],
		} );
	} );
} );
