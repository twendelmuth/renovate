import { getName, loadFixture } from '../../../test/util';
import { id as githubReleaseDatasource } from '../../datasource/github-releases';
import { id as semverVersioning } from '../../versioning/semver';
import type { PackageDependency } from '../types';
import { extractPackageFile } from './extract';

const validWrapperContent = loadFixture(__filename, 'valid-wrapper');
const malformedWrapperContent = loadFixture(__filename, 'malformed-wrapper');

describe(getName(__filename), () => {
  describe('extractPackageFile()', () => {
    it('returns null for empty wrapper file', () => {
      expect(extractPackageFile('')).toBeNull();
    });

    it('returns null for file without version information', () => {
      expect(extractPackageFile('nothing here')).toBeNull();
    });

    it('extracts the current version from a valid wrapper script', () => {
      const res = extractPackageFile(validWrapperContent);

      const expectedDependency: PackageDependency = {
        depName: 'batect/batect',
        commitMessageTopic: 'Batect',
        currentValue: '0.60.1',
        datasource: githubReleaseDatasource,
        versioning: semverVersioning,
      };

      expect(res).toEqual({ deps: [expectedDependency] });
    });

    it('returns the first version from a wrapper script with multiple versions', () => {
      const res = extractPackageFile(malformedWrapperContent);

      const expectedDependency: PackageDependency = {
        depName: 'batect/batect',
        commitMessageTopic: 'Batect',
        currentValue: '0.60.1',
        datasource: githubReleaseDatasource,
        versioning: semverVersioning,
      };

      expect(res).toEqual({ deps: [expectedDependency] });
    });
  });
});
