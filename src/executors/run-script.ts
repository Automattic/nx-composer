import { ExecutorContext } from '@nrwl/devkit';
import { join } from 'path';
import { ComposerRunner } from '../utils/composer-runner';

/**
 * An interface describing this executor's schema.
 */
interface RunScriptExecutorOptions {
	readonly composerPath: string;
	readonly script: string;
	readonly options: string[];
}

/**
 * An executor for running composer commands.
 *
 * @param {RunScriptExecutorOptions} options The options for the executor.
 * @param {ExecutorContext}          context The context for the execution.
 */
export default async function runScriptExecutor(
	options: RunScriptExecutorOptions,
	context: ExecutorContext
): Promise< { success: boolean } > {
	if ( ! context.projectName ) {
		return { success: false };
	}

	// Make sure that we are running commands in the project's directory.
	const projectPath = join(
		context.root,
		context.workspace.projects[ context.projectName ].root
	);

	// Execute the command using composer.
	const runner = new ComposerRunner( options.composerPath );
	const result = runner.execute( projectPath, 'run-script', [
		options.script,
		...options.options,
	] );

	if ( result.error ) {
		if ( context.isVerbose ) {
			console.error( result.output );
		}

		return { success: false };
	}

	console.info( result.output );

	return { success: true };
}
