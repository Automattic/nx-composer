import { join } from 'path';
import { ComposerConfig } from '../composer-config';

describe( 'ComposerConfig', () => {
	const workspaceDir = join( __dirname, '..', '..', '..', 'test-workspace' );

	it( 'should error for missing files', () => {
		expect(
			() =>
				new ComposerConfig(
					join( workspaceDir, 'missing-package', 'composer.json' )
				)
		).toThrowError();
	} );

	it( 'should load config', () => {
		const config = new ComposerConfig(
			join( workspaceDir, 'package-a', 'composer.json' )
		);
		const dependencies = config.getDependencies();

		expect( config.getName() ).toStrictEqual( 'nx-composer/package-a' );

		expect( dependencies.size ).toEqual( 3 );
		expect( dependencies ).toContain( 'nx-composer/package-b' );
		expect( dependencies ).toContain( 'external/dependency' );
		expect( dependencies ).toContain( 'developer/dependency' );
	} );
} );
