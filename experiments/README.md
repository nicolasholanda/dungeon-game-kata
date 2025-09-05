# Chaos Engineering Experiments

This directory contains chaos engineering experiments using Chaos Toolkit with additional tools for comprehensive testing.

## Custom Chaos Toolkit Container

The custom container includes:
- Chaos Toolkit base framework
- k6 for load testing
- Pumba for container chaos
- Reporting capabilities with pandoc
- System dependencies for advanced reporting

## Setup

Build the custom chaos toolkit image:
```bash
docker build -t custom-chaos-image ./chaostoolkit
```

## Running Experiments

### Basic Usage
Run any experiment:
```bash
docker run --rm --network=host -v .:/experiments -v ./logs:/home/chaostoolkit/logs custom-chaos-image run /experiments/<experiment-file>.json
```

### With Environment Variables
Override default variables:
```bash
docker run --rm --network=host -v .:/experiments -v ./logs:/home/chaostoolkit/logs -e app_url=http://localhost:8080 custom-chaos-image run /experiments/<experiment-file>.json
```

### Interactive Container Access
Start container for multiple experiments:
```bash
docker run -it --network=host -v .:/experiments -v ./logs:/home/chaostoolkit/logs custom-chaos-image bash
```

Then inside the container:
```bash
chaos run /experiments/<experiment-file>.json
```

## Logs and Reports

All experiment logs and journals are saved to the `./logs` directory and persisted on the host machine.

## Network Configuration

The container uses `--network=host` to access services running on the host machine (like HAProxy on port 80/8080).
