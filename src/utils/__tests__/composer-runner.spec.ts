import { ComposerRunner } from '../composer-runner';

describe( 'ComposerRunner', () => {
	it( 'should error when not using composer', () => {
		const runner = new ComposerRunner( 'wrong-file-forever' );

		const result = runner.execute( 'about' );

		expect( result ).toMatchObject( {
			error: true,
			output: 'spawnSync wrong-file-forever ENOENT',
		} );
	} );

	it( 'should execute composer commands', () => {
		const runner = new ComposerRunner( 'composer' );

		const result = runner.execute( 'about' );

		expect( result ).toHaveProperty( 'error', false );
	} );

	it( 'should return composer errors', () => {
		const runner = new ComposerRunner( 'composer' );

		const result = runner.execute( 'wrong-command-forever' );

		expect( result ).toHaveProperty( 'error', true );
	} );
} );
