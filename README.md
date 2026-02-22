# OpenClaw (Clawbot) Docker Image

Pre-built Docker image for [OpenClaw](https://github.com/openclaw/openclaw) — run your AI assistant in seconds without building from source.

> 🔄 **Always Up-to-Date:** This image automatically builds daily and checks for new OpenClaw releases every 6 hours, ensuring you always have the latest version.

## One-Line Install (Recommended)

### Linux / macOS

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/phioranex/openclaw-docker/main/install.sh)
```

### Windows (PowerShell)

```powershell
irm https://raw.githubusercontent.com/phioranex/openclaw-docker/main/install.ps1 | iex
```

> **Note for Windows users:** Make sure Docker Desktop is installed and running. You can also use WSL2 with the Linux installation command.

This will:
- ✅ Check prerequisites (Docker, Docker Compose)
- ✅ Download necessary files
- ✅ Pull the pre-built image
- ✅ Run the onboarding wizard
- ✅ Start the gateway

### Install Options

**Linux / macOS:**

### Install Options

**Linux / macOS:**

```bash
# Just pull the image (no setup)
bash <(curl -fsSL https://raw.githubusercontent.com/phioranex/openclaw-docker/main/install.sh) --pull-only

# Skip onboarding (if already configured)
bash <(curl -fsSL https://raw.githubusercontent.com/phioranex/openclaw-docker/main/install.sh) --skip-onboard

# Don't start gateway after setup
bash <(curl -fsSL https://raw.githubusercontent.com/phioranex/openclaw-docker/main/install.sh) --no-start

# Custom install directory
bash <(curl -fsSL https://raw.githubusercontent.com/phioranex/openclaw-docker/main/install.sh) --install-dir /opt/openclaw
```

**Windows (PowerShell):**

```powershell
# Just pull the image (no setup)
irm https://raw.githubusercontent.com/phioranex/openclaw-docker/main/install.ps1 | iex -PullOnly

# Skip onboarding (if already configured)
irm https://raw.githubusercontent.com/phioranex/openclaw-docker/main/install.ps1 | iex -SkipOnboard

# Don't start gateway after setup
irm https://raw.githubusercontent.com/phioranex/openclaw-docker/main/install.ps1 | iex -NoStart

# Custom install directory
$env:TEMP_INSTALL_SCRIPT = irm https://raw.githubusercontent.com/phioranex/openclaw-docker/main/install.ps1; Invoke-Expression $env:TEMP_INSTALL_SCRIPT -InstallDir "C:\openclaw"
```

## Manual Install

### Quick Start

```bash
# Pull the image
docker pull ghcr.io/phioranex/openclaw-docker:latest

# Run onboarding (first time setup)
docker run -it --rm \
  -v ~/.openclaw:/home/node/.openclaw \
  -v ~/.openclaw/workspace:/home/node/.openclaw/workspace \
  ghcr.io/phioranex/openclaw-docker:latest onboard

# Start the gateway
docker run -d \
  --name openclaw \
  --restart unless-stopped \
  -v ~/.openclaw:/home/node/.openclaw \
  -v ~/.openclaw/workspace:/home/node/.openclaw/workspace \
  -p 18789:18789 \
  ghcr.io/phioranex/openclaw-docker:latest gateway start --foreground
```

### Using Docker Compose

```bash
# Clone this repo
git clone https://github.com/phioranex/openclaw-docker.git
cd openclaw-docker

# Run onboarding
docker compose run --rm openclaw-cli onboard

# Start the gateway
docker compose up -d openclaw-gateway
```

## Configuration

During onboarding, you'll configure:
- **AI Provider** (Anthropic Claude, OpenAI, etc.)
- **Channels** (Telegram, WhatsApp, Discord, etc.)
- **Gateway settings**

Config is stored in `~/.openclaw/` and persists across container restarts.

## Available Tags

| Tag | Description |
|-----|-------------|
| `latest` | Latest OpenClaw build (updated daily and on new releases) |
| `vX.Y.Z` | Specific version (if available) |
| `main` | Latest from main branch (cutting edge) |

> **Note:** The `latest` tag is automatically rebuilt daily at 00:00 UTC and whenever OpenClaw releases a new version.

## Volumes

| Path | Purpose |
|------|---------|
| `/home/node/.openclaw` | Config and session data |
| `/home/node/.openclaw/workspace` | Agent workspace |

## Ports

| Port | Purpose |
|------|---------|
| `18789` | Gateway API + Dashboard |

## Links

- [OpenClaw Website](https://openclaw.ai/)
- [OpenClaw Docs](https://docs.openclaw.ai)
- [OpenClaw GitHub](https://github.com/openclaw/openclaw)
- [Discord Community](https://discord.gg/clawd)

## Uninstallation

### One-Line Uninstall

**Linux / macOS:**

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/phioranex/openclaw-docker/main/uninstall.sh)
```

**Windows (PowerShell):**

```powershell
irm https://raw.githubusercontent.com/phioranex/openclaw-docker/main/uninstall.ps1 | iex
```

This will:
- ✅ Stop and remove all containers
- ✅ Ask before removing configuration and workspace data
- ✅ Ask before removing Docker image
- ✅ Ask before removing installation directory

### Uninstall Options

**Linux / macOS:**

```bash
# Keep configuration and workspace data
bash <(curl -fsSL https://raw.githubusercontent.com/phioranex/openclaw-docker/main/uninstall.sh) --keep-data

# Keep Docker image (useful if reinstalling later)
bash <(curl -fsSL https://raw.githubusercontent.com/phioranex/openclaw-docker/main/uninstall.sh) --keep-image

# Skip all confirmation prompts
bash <(curl -fsSL https://raw.githubusercontent.com/phioranex/openclaw-docker/main/uninstall.sh) --force

# Custom install directory
bash <(curl -fsSL https://raw.githubusercontent.com/phioranex/openclaw-docker/main/uninstall.sh) --install-dir /opt/openclaw
```

**Windows (PowerShell):**

```powershell
# Keep configuration and workspace data
& ([scriptblock]::Create((irm https://raw.githubusercontent.com/phioranex/openclaw-docker/main/uninstall.ps1))) -KeepData

# Keep Docker image (useful if reinstalling later)
& ([scriptblock]::Create((irm https://raw.githubusercontent.com/phioranex/openclaw-docker/main/uninstall.ps1))) -KeepImage

# Skip all confirmation prompts
& ([scriptblock]::Create((irm https://raw.githubusercontent.com/phioranex/openclaw-docker/main/uninstall.ps1))) -Force

# Custom install directory
& ([scriptblock]::Create((irm https://raw.githubusercontent.com/phioranex/openclaw-docker/main/uninstall.ps1))) -InstallDir "C:\openclaw"
```

### Manual Uninstall

If you prefer to uninstall manually:

```bash
# Stop and remove containers
docker stop openclaw-gateway openclaw-socat
docker rm openclaw-gateway openclaw-socat openclaw-cli

# Remove data (optional)
rm -rf ~/.openclaw

# Remove Docker image (optional)
docker rmi ghcr.io/phioranex/openclaw-docker:latest

# Remove installation directory (optional)
rm -rf ~/openclaw
```

## Troubleshooting

### Permission Issues on Synology NAS

If you encounter `EACCES: permission denied` errors when running on Synology NAS:

1. **Option 1: Run install script with sudo (Recommended)**
   ```bash
   sudo bash <(curl -fsSL https://raw.githubusercontent.com/phioranex/openclaw-docker/main/install.sh)
   ```
   The script will automatically:
   - Set proper ownership (UID 1000) for the container user
   - Configure your user account to access the files
   - Update docker-compose.yml to use the correct home directory

2. **Option 2: Fix permissions manually**
   ```bash
   # RECOMMENDED: Set ownership to UID 1000 with group access (most secure)
   sudo chown -R 1000:$(id -g) ~/.openclaw
   sudo chmod -R u+rwX,g+rwX,o-rwx ~/.openclaw
   
   # Alternative: Make directory writable by owner and group (less secure)
   chmod -R 775 ~/.openclaw
   
   # LAST RESORT ONLY: World-writable (least secure, use only if above options fail)
   # chmod -R 777 ~/.openclaw
   ```

3. **Option 3: Use host user mapping**
   Edit `docker-compose.yml` and uncomment the `user: "1000:1000"` line in both services:
   ```yaml
   user: "1000:1000"  # Uncomment this line
   ```

### Telegram Bot Connection Issues

If the Telegram bot cannot find your username or numeric ID:

1. Ensure your container has internet access:
   ```bash
   docker exec openclaw-gateway ping -c 3 api.telegram.org
   ```

2. Check if firewall or network restrictions are blocking Telegram API access

3. Verify your Telegram bot token is correct in `~/.openclaw/openclaw.json`

### Docker Permission Issues (Image Pull)

If you need root/sudo to pull Docker images:

1. Add your user to the docker group:
   ```bash
   sudo usermod -aG docker $USER
   ```

2. Log out and log back in for the changes to take effect

3. Alternatively, use `sudo` when running the install script

### Python packages (e.g. `requests`) inside the container

The default image does not include Python or allow installing pip packages at runtime. To let OpenClaw (or skills) use packages like `requests` inside the container, use one of these approaches.

**Option 1 – Custom image with Python and packages (recommended)**

Build an image that extends the official one and installs Python plus the packages you need:

```bash
# From this repo directory
docker build -f Dockerfile.python-packages -t openclaw-docker:with-python .
```

Then point Compose at your image: in `docker-compose.yml`, set the image for `openclaw-gateway` and `openclaw-cli`:

```yaml
services:
  openclaw-gateway:
    image: openclaw-docker:with-python   # was: ghcr.io/phioranex/openclaw-docker:latest
    # ... rest unchanged
  openclaw-cli:
    image: openclaw-docker:with-python
    # ... rest unchanged
```

To add more packages, edit `Dockerfile.python-packages`: add them to the `pip3 install` line (or uncomment the second `RUN pip3 install` and list packages there), then rebuild the image.

**Option 2 – One-off install in a running container**

If your container already has Python/pip (e.g. from a skill or Homebrew), you can install packages as the `node` user so they persist only for that container:

```bash
docker exec -u node openclaw-gateway pip3 install --user requests
```

Installs go to `/home/node/.local` and are lost when the container is recreated unless you use a volume for that path or rebuild a custom image (Option 1).

### Installing Skills (npm global packages)

The container is configured to allow the `node` user to install global npm packages without permission issues. You can install skills using:

```bash
# If using docker compose
docker compose exec openclaw-gateway npm install -g @package/name

# If using standalone container
docker exec -it <container_name> npm install -g @package/name

# Find your container name with:
docker ps
```

If you're using `user: "1000:1000"` in docker-compose.yml, global npm installs will work without any additional configuration.

## YouTube Tutorial

📺 Watch the installation tutorial: [Coming Soon]

## License

This Docker packaging is provided by [Phioranex](https://phioranex.com).
OpenClaw itself is licensed under MIT — see the [original repo](https://github.com/openclaw/openclaw).
