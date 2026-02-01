# Claude Instructions for klab-web

## Git Workflow

- **Default branch**: `main`
- **Always create feature branches** before making changes:
  - Format: `feat/<description>` or `fix/<description>`
  - Example: `feat/monokai-theme`, `fix/terminal-overflow`
- **Never push directly to main** - always use feature branches
- **Pull Requests**: Create PRs from feature branch → `main`
- **Branch creation**: `git checkout -b feat/feature-name` before first commit

### Workflow Steps

1. Create feature branch: `git checkout -b feat/feature-name`
2. Make commits on feature branch
3. Push feature branch: `git push -u origin feat/feature-name`
4. Create PR: `gh pr create --base main --head feat/feature-name`
5. After merge, sync main: `git checkout main && git pull`
