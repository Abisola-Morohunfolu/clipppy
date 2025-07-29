const { FlatCompat } = require('@eslint/eslintrc')
const jsConfig = require('./.eslintrc.js')
const js = require('@eslint/js')

const compat = new FlatCompat({
	baseDirectory: __dirname,
	resolvePluginsRelativeTo: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
})

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
			'**/*.d.ts'
		]
	},
	...compat.config(jsConfig).map(config => ({
		...config,
		files: ['**/*.js']
	}))
]

module.exports = config