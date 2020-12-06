# rtx3000-fe-stock-cli
 CLI tool to check UK stock of Nvidia 3000 series FE GPU's

## Installation
```bash
npm install -g @rossocodes/nvidia-fe-stock-cli
```

## Usage

You will need the following to use this tool:

1. A Gmail account to send the notification email from. (You will need to allow access for unsecure apps for this to work. Probably best to create a new account just for this, rather than using an existing account)
2. An email address to recieve the notification

```bash
nvidia-fe-stock-cli -m <the rtx 3000 series model you are after e.g 3060 ti> -f <your Gmail address here> -p <your Gmail password here> -e <your email address here> -r <optional: how often you would like to check the stock, it is every 2 minutes by default e.g 120>
```

## Examples

### Help

```bash
nvidia-fe-stock-cli --help
```

### RTX 3080

```bash
nvidia-fe-stock-cli -m 3080 -f your.email@gmail.com -p password123 -e you@outlook.com -r 300
```