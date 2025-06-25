const {start} = require('./server')

const main = () => {
    start({port: process.env.PORT || 8000})
}

main()