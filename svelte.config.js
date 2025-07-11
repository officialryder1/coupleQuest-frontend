import adapter from '@sveltejs/adapter-vercel';


const config = { kit: { adapter: adapter() }, prerender: {
    handleHttpError: 'warn' // or 'ignore'
  } };

export default config;
