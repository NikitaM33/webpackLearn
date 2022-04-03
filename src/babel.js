async function start () {
    return await Promise.resolve('Async is working!');
}

start().then(console.log);

const u = 23;

class Util {
    static id = Date.now();
};

console.log('Util ID:', Util.id);
