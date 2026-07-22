import { type Rule } from '@angular-devkit/schematics';

import type { AerisNgAddSchema } from './schema';
import { resolveAerisSetup } from './options';
import { applyAerisSetup, getApplicationNames } from './workspace';

export function ngAdd(options: AerisNgAddSchema): Rule {
  return async (tree, context) => {
    const applications = await getApplicationNames(tree);
    const setup = await resolveAerisSetup(tree, context, options, applications);
    return applyAerisSetup(tree, context, setup);
  };
}
