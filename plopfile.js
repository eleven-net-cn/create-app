export default function (plop) {
  plop.setGenerator('template', {
    description: 'Create a new template package',
    prompts: [
      {
        type: 'input',
        name: 'templateName',
        message: 'Template name (without template- prefix):',
        validate: input => {
          if (!input) return 'Template name is required';
          if (!/^[a-z0-9-]+$/.test(input)) {
            return 'Template name must contain only lowercase letters, numbers, and hyphens';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'description',
        message: 'Template description:',
        default: answers => `Template for ${answers.templateName}`,
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'packages/template-{{templateName}}/package.json',
        templateFile: 'template/package.json.hbs',
      },
      {
        type: 'add',
        path: 'packages/template-{{templateName}}/src/index.ts',
        templateFile: 'template/src/index.ts.hbs',
      },
      {
        type: 'add',
        path: 'packages/template-{{templateName}}/src/prompts.ts',
        templateFile: 'template/src/prompts.ts.hbs',
      },
      {
        type: 'add',
        path: 'packages/template-{{templateName}}/src/types.ts',
        templateFile: 'template/src/types.ts.hbs',
      },
      {
        type: 'add',
        path: 'packages/template-{{templateName}}/README.md',
        templateFile: 'template/README.md.hbs',
      },
      {
        type: 'add',
        path: 'packages/template-{{templateName}}/template/.gitkeep',
        template: '',
      },
    ],
  });
}
