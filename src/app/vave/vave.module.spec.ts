import { VaveModule } from './vave.module';

describe('VaveModule', () => {
  let vaveModule: VaveModule;

  beforeEach(() => {
    vaveModule = new VaveModule();
  });

  it('should create an instance', () => {
    expect(vaveModule).toBeTruthy();
  });
});
