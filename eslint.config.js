// eslint.config.js (ESM / Flat config)
import neostandard from 'neostandard'

const config = [
	{
		ignores: [
			'build/**',
			'resources/**',
			'coverage/**',
			'test/**',
			'test-e2e/**',
			'e2e/**',
			'**/*test*',
			'**/*.test.js',
			'**/isos-alerts-job.js',
			'lib/dist',
			'dist/**',
			'**/*.d.ts',
			'node_modules/**',
			'.eslintrc.js',
		],
	},
	...neostandard(),
	{
		rules: {
			eqeqeq: 0,
			'@stylistic/no-tabs': 0,
			'@stylistic/no-mixed-spaces-and-tabs': 0,
			'@stylistic/linebreak-style': 'off',
			'@stylistic/indent': ['error', 'tab'],
			'@stylistic/quotes': ['error', 'single'],
			'@stylistic/padding-line-between-statements': [
				2,
				// Always require blank lines after directive (like 'use-strict'), except between directives
				{ blankLine: 'always', prev: 'directive', next: '*' },
				{ blankLine: 'any', prev: 'directive', next: 'directive' },
				// Always require blank lines after import, except between imports
				{ blankLine: 'always', prev: 'import', next: '*' },
				{ blankLine: 'any', prev: 'import', next: 'import' },
				// Always require blank lines before and after every sequence of variable declarations and export
				{
					blankLine: 'always',
					prev: '*',
					next: ['const', 'let', 'var', 'export']
				},
				{
					blankLine: 'always',
					prev: ['const', 'let', 'var', 'export'],
					next: '*'
				},
				{
					blankLine: 'any',
					prev: ['const', 'let', 'var', 'export'],
					next: ['const', 'let', 'var', 'export']
				},
				// Always require blank lines before and after class declaration, if, do/while, switch, try
				{
					blankLine: 'always',
					prev: '*',
					next: ['if', 'class', 'for', 'do', 'while', 'switch', 'try']
				},
				{
					blankLine: 'always',
					prev: ['if', 'class', 'for', 'do', 'while', 'switch', 'try'],
					next: '*'
				},
				// Always require blank lines before return statements
				{ blankLine: 'always', prev: '*', next: 'return' }
			],
			'@stylistic/no-callback-literal': 0,
			'no-void': 0
		}
	}
]

export default config
