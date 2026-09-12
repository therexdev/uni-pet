const { MockVM } = require('@koinos/mock-vm');
module.exports = {
  entries: ['assembly/__tests__/**/*.spec.ts'],
  include: ['assembly/__tests__/**/*.include.ts'],
  disclude: [/node_modules/],
  async instantiate(memory, createImports, instantiate, binary) {
    const vm = new MockVM();
    const put = vm.db.putObject.bind(vm.db);
    vm.db.putObject = (space, key, value) =>
      put(space, Uint8Array.from(key), Uint8Array.from(value));
    const instance = await instantiate(
      binary,
      createImports({
        env: { memory, ...vm.getImports() },
        wasi_snapshot_preview1: { fd_write: () => 0, proc_exit: () => 0 },
      }),
    );
    vm.setInstance(instance);
    return instance;
  },
  outputBinary: false,
};
