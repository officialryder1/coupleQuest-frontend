import adapter from '@sveltejs/adapter-cloudflare'


const config = { kit: { adapter: adapter() }, prerender: {
    handleHttpError: 'warn' // or 'ignore'
  } };

export default config;
