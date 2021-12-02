export default {
    mode: 'jit', // Just-In-Time Compiler
    purge: ['./src/**/*.html'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        screens: {
            'sm': '320px',
            'md': '740px',
            'lg': '980px',
            'xl': '1300px',
        },
      extend: {},
    },
    variants: {
      extend: {},
    },
    plugins: [],
  }