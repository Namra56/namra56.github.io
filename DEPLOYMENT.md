# GitHub Pages deployment

The workflow in `.github/workflows/deploy-pages.yml` builds and deploys the portfolio whenever `main` is updated.

## Initial setup

1. Create a GitHub repository named `Namra56.github.io`.
2. Push this project to that repository.
3. In the repository, open **Settings → Pages**.
4. Set **Source** to **GitHub Actions**.
5. Push to `main` or run **Deploy portfolio to GitHub Pages** from the Actions tab.

For the `Namra56.github.io` repository, the workflow automatically uses `/` as the Vite base path and publishes to `https://namra56.github.io/`.
For a normal project repository, the workflow automatically builds with `/<repository-name>/` as the Vite base path. For a repository named `<username>.github.io`, it uses `/`.

## Custom domain

Only configure a domain after it has been registered and points to GitHub Pages.

1. Open **Settings → Secrets and variables → Actions → Variables**.
2. Create `CUSTOM_DOMAIN` with the domain only, for example `namrakapadia.is-a.dev`.
3. Run the deployment workflow again.

When `CUSTOM_DOMAIN` is set, the workflow builds from `/` and writes the required `CNAME` file into the deployment artifact. The domain still needs to be registered with its provider and configured in **Settings → Pages**.

To override only the asset base path, create the repository variable `VITE_BASE_PATH`.
