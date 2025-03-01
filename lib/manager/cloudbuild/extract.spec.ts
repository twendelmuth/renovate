import { getName, loadFixture } from '../../../test/util';
import { extractPackageFile } from './extract';

const file1 = loadFixture(__filename, 'cloudbuild.yml');

describe(getName(__filename), () => {
  describe('extractPackageFile()', () => {
    it('returns null for empty', () => {
      expect(extractPackageFile('nothing here')).toBeNull();
    });
    it('extracts multiple image lines', () => {
      const res = extractPackageFile(file1);
      expect(res.deps).toMatchSnapshot();
      expect(res.deps).toHaveLength(3);
    });
  });
});
