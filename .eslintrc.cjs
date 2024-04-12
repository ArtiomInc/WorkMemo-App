module.exports = {
    env: {
      node: true,
      'vue/setup-compiler-macros': true,
    },
    extends: [
      'plugin:vue/vue3-essential',
      'plugin:vue/vue3-strongly-recommended',
      'plugin:vue/vue3-recommended',
      'eslint:recommended',
      '@vue/eslint-config-typescript/recommended',
      '@vue/eslint-config-prettier',
    ],
    plugins: ['perfectionist'],
    root: true,
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'vue/no-v-html':'off',
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'perfectionist/sort-named-imports': 'error',
      'perfectionist/sort-imports': [
        'error',
        {
          groups: [
            'type',
            ['builtin', 'external'],
            'internal-type',
            'internal',
            'vue-component',
            ['parent-type', 'sibling-type', 'index-type'],
            ['parent', 'sibling', 'index'],
            'object',
            'unknown',
          ],
        },
      ],
    },
  }
  