import { spawnSync } from 'child_process';

/**
 * An interface for the result of a command execution.
 */
interface ComposerResult {
	readonly error: boolean;
	readonly output: string;
}

/**
 * A utility for executing Composer commands.
 */
export class ComposerRunner {
	/**
	 * The path to the composer executable.
	 */
	private readonly composerPath: string;

	/**
	 * Constructor.
	 *
	 * @param {string} composerPath The path to the composer executable.
	 */
	public constructor( composerPath: string ) {
		this.composerPath = composerPath;
	}

	/**
	 * Executes a composer command and returns the output or error.
	 *
	 * @param {string}         directory The directory we want to execute the command in.
	 * @param {string}         command   The composer command to execute.
	 * @param {Array.<string>} [params]  The parameters to pass to the composer command.
	 */
	public execute(
		directory: string,
		command: string,
		params: string[] = []
	): ComposerResult {
		const output = spawnSync( this.composerPath, [ command, ...params ], {
			cwd: directory,
			encoding: 'utf8',
		} );

		return { error: output.status !== 0, output: output.stdout };
	}
}
