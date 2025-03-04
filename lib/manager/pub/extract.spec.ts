import { getName, loadFixture } from '../../../test/util';
import { extractPackageFile } from '.';

const brokenYaml = loadFixture(__filename, 'update.yaml');
const packageFile = loadFixture(__filename, 'extract.yaml');

describe(getName(__filename), () => {
  describe('extractPackageFile', () => {
    it('should return null if package does not contain any deps', () => {
      const res = extractPackageFile('foo: bar', 'pubspec.yaml');
      expect(res).toBeNull();
    });
    it('should return null if package is invalid', () => {
      const res = extractPackageFile(brokenYaml, 'pubspec.yaml');
      expect(res).toBeNull();
    });
    it('should return valid dependencies', () => {
      const res = extractPackageFile(packageFile, 'pubspec.yaml');
      expect(res).toMatchSnapshot();
    });
  });
});
