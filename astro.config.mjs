// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.finntegrate.org',
	integrations: [
		starlight({
			title: 'Finntegrate Docs',
			social: [ { icon: 'github', label: 'GitHub', href: 'https://github.com/finntegrate/knowledgebase' } ],
			sidebar: [
				{
					label: 'Project',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Charter', slug: 'project/charter' },
						{ label: 'Context and Opportunities', slug: 'project/context-and-opportunities' },
					],
				},
				{ label: 'Brand', autogenerate: { directory: 'brand' }, },
				{
					label: 'Research',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Immigrant Journey', autogenerate: { directory: 'research/immigrant-journey' }, },
						{ label: 'Information Landscape', autogenerate: { directory: 'research/information-landscape' }, },
						{ label: 'Technology', autogenerate: { directory: 'research/technology' }, },
					],
				},
			],
		}),
	],
});
