import { getName, loadFixture, mocked } from '../../../test/util';
import * as _hostRules from '../../util/host-rules';
import { extractPackageFile } from './extract';

jest.mock('../../util/host-rules');
const hostRules = mocked(_hostRules);
const filename = '.pre-commit.yaml';

const complexPrecommitConfig = loadFixture(
  __filename,
  'complex.pre-commit-config.yaml'
);
const examplePrecommitConfig = loadFixture(
  __filename,
  '.pre-commit-config.yaml'
);
const emptyReposPrecommitConfig = loadFixture(
  __filename,
  'empty_repos.pre-commit-config.yaml'
);
const noReposPrecommitConfig = loadFixture(
  __filename,
  'no_repos.pre-commit-config.yaml'
);
const invalidRepoPrecommitConfig = loadFixture(
  __filename,
  'invalid_repo.pre-commit-config.yaml'
);
const enterpriseGitPrecommitConfig = loadFixture(
  __filename,
  'enterprise.pre-commit-config.yaml'
);

describe(getName(__filename), () => {
  describe('extractPackageFile()', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
    it('returns null for invalid yaml file content', () => {
      const result = extractPackageFile('nothing here: [', filename);
      expect(result).toBeNull();
    });
    it('returns null for empty yaml file content', () => {
      const result = extractPackageFile('', filename);
      expect(result).toBeNull();
    });
    it('returns null for no file content', () => {
      const result = extractPackageFile(null, filename);
      expect(result).toBeNull();
    });
    it('returns null for no repos', () => {
      const result = extractPackageFile(noReposPrecommitConfig, filename);
      expect(result).toBeNull();
    });
    it('returns null for empty repos', () => {
      const result = extractPackageFile(emptyReposPrecommitConfig, filename);
      expect(result).toBeNull();
    });
    it('returns null for invalid repo', () => {
      const result = extractPackageFile(invalidRepoPrecommitConfig, filename);
      expect(result).toBeNull();
    });
    it('extracts from values.yaml correctly with same structure as "pre-commit sample-config"', () => {
      const result = extractPackageFile(examplePrecommitConfig, filename);
      expect(result).toMatchSnapshot();
    });
    it('extracts from complex config file correctly', () => {
      const result = extractPackageFile(complexPrecommitConfig, filename);
      expect(result).toMatchSnapshot();
    });
    it('can handle private git repos', () => {
      hostRules.find.mockReturnValue({ token: 'value' });
      const result = extractPackageFile(enterpriseGitPrecommitConfig, filename);
      expect(result).toMatchSnapshot();
    });
    it('can handle invalid private git repos', () => {
      hostRules.find.mockReturnValue({});
      const result = extractPackageFile(enterpriseGitPrecommitConfig, filename);
      expect(result).toMatchSnapshot();
    });
    it('can handle unknown private git repos', () => {
      // First attemp returns a result
      hostRules.find.mockReturnValueOnce({ token: 'value' });
      // But all subsequent checks (those with hostType), then fail:
      hostRules.find.mockReturnValue({});
      const result = extractPackageFile(enterpriseGitPrecommitConfig, filename);
      expect(result).toMatchSnapshot();
    });
  });
});
