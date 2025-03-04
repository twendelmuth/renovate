import { getName, loadFixture } from '../../../test/util';
import { extractPackageFile } from './extract';

const invalidYamlFile = loadFixture(__filename, 'invalid.yaml');

const pluginsTextFile = loadFixture(__filename, 'plugins.txt');
const pluginsYamlFile = loadFixture(__filename, 'plugins.yaml');

const pluginsEmptyTextFile = loadFixture(__filename, 'empty.txt');
const pluginsEmptyYamlFile = loadFixture(__filename, 'empty.yaml');

describe(getName(__filename), () => {
  describe('extractPackageFile()', () => {
    it('returns empty list for an empty text file', () => {
      const res = extractPackageFile(pluginsEmptyTextFile, 'path/file.txt');
      expect(res).toBeNull();
    });

    it('returns empty list for an empty yaml file', () => {
      const res = extractPackageFile(pluginsEmptyYamlFile, 'path/file.yaml');
      expect(res).toBeNull();
    });

    it('returns empty list for an invalid yaml file', () => {
      const res = extractPackageFile(invalidYamlFile, 'path/file.yaml');
      expect(res).toBeNull();
    });

    it('extracts multiple image lines in text format', () => {
      const res = extractPackageFile(pluginsTextFile, 'path/file.txt');
      expect(res.deps).toMatchSnapshot();
      expect(res.deps).toHaveLength(6);
    });

    it('extracts multiple image lines in yaml format', () => {
      const res = extractPackageFile(pluginsYamlFile, 'path/file.yml');
      expect(res.deps).toMatchSnapshot();
      expect(res.deps).toHaveLength(8);
    });
  });
});
