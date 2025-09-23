// eslint.config.js (ESM / Flat config)
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// If you're importing a legacy .eslintrc.js (CommonJS), default import works in ESM.
import jsConfig from './.eslintrc.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
	resolvePluginsRelativeTo: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

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
		],
	},
	...compat.config(jsConfig).map((cfg) => ({
		...cfg,
		files: ['**/*.js'],
	})),
];

export default config;
