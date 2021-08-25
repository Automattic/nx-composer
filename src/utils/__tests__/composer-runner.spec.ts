import { ComposerRunner } from '../composer-runner';

describe( 'ComposerRunner', () => {
	it( 'should error when not using composer', () => {
		const runner = new ComposerRunner( 'wrong-file-forever' );

		const result = runner.execute( __dirname, 'about' );

		expect( result ).toHaveProperty( 'error', true );
	} );

	it( 'should execute composer commands', () => {
		const runner = new ComposerRunner( 'composer' );

		const result = runner.execute( __dirname, 'about' );

		expect( result ).toHaveProperty( 'error', false );
	} );

	it( 'should return composer errors', () => {
		const runner = new ComposerRunner( 'composer' );

		let result = runner.execute( __dirname, 'wrong-command-forever' );

		expect( result ).toHaveProperty( 'error', true );

		result = runner.execute( __dirname, 'exec', [
			'wrong-command-forever',
		] );

		expect( result ).toHaveProperty( 'error', true );
	} );
} );
