import { ProjectGraph, ProjectGraphProcessorContext } from '@nrwl/devkit';
import { DependencyBuilder } from './utils/dependency-builder';

/**
 * Adds Composer dependencies to Nx's project graph.
 *
 * Note: The name of this function is important; Nx is specifically looking for it!
 *
 * @param {ProjectGraph}                 graph   The graph to process.
 * @param {ProjectGraphProcessorContext} context The context for the graph we are generating.
 */
export function processProjectGraph(
	graph: ProjectGraph,
	context: ProjectGraphProcessorContext
): ProjectGraph {
	const builder = new DependencyBuilder( context.workspace );
	return builder.addDependencies( graph );
}
