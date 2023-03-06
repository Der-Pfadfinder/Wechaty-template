import { fork } from 'child_process'

function createWorker() {
    let worker = fork('dist/process.js');
    worker.on('exit', () => {
        createWorker();
    })
}

createWorker();