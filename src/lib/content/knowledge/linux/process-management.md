# Linux Process Management

A **process** is an instance of a running program. Linux provides powerful tools to monitor, control, and manage processes.

## Viewing Processes

### ps - Process Status

**Basic usage:**
```bash
ps              # Show processes in current shell
ps -e           # Show all processes
ps -f           # Full format listing
ps -ef          # All processes, full format
ps aux          # BSD-style detailed view
```

**Common combinations:**
```bash
ps aux | grep nginx        # Find nginx processes
ps -ef | grep python       # Find python processes
ps -u username             # Processes for specific user
ps -p 1234                 # Specific process by PID
```

**Output columns:**
- **PID**: Process ID
- **PPID**: Parent Process ID
- **USER**: Process owner
- **%CPU**: CPU usage percentage
- **%MEM**: Memory usage percentage
- **STAT**: Process state (R=running, S=sleeping, Z=zombie)
- **START**: Start time
- **TIME**: CPU time consumed
- **COMMAND**: Command that started the process

### top - Interactive Process Viewer

```bash
top              # Real-time process view
htop             # Enhanced version (if installed)
```

**Interactive commands:**
- `k` - Kill a process
- `r` - Renice (change priority)
- `P` - Sort by CPU usage
- `M` - Sort by memory usage
- `q` - Quit

### Process Tree

```bash
pstree           # Show process hierarchy
pstree -p        # Include PIDs
ps -ef --forest  # Tree view with ps
```

## Process States

- **R** (Running): Currently executing
- **S** (Sleeping): Waiting for event
- **D** (Uninterruptible sleep): Usually I/O wait
- **T** (Stopped): Suspended
- **Z** (Zombie): Terminated but not reaped by parent

## Signals

Signals are messages sent to processes to trigger actions.

### Common Signals

| Signal | Number | Description | Use Case |
|--------|--------|-------------|----------|
| SIGTERM | 15 | Terminate gracefully | Default kill |
| SIGKILL | 9 | Force kill immediately | Unresponsive processes |
| SIGHUP | 1 | Hang up, reload config | Restart services |
| SIGINT | 2 | Interrupt (Ctrl+C) | Stop foreground process |
| SIGSTOP | 19 | Pause process | Suspend execution |
| SIGCONT | 18 | Resume process | Continue suspended process |

## Terminating Processes

### kill - Send Signal to Process

```bash
kill PID                # Send SIGTERM (graceful)
kill -9 PID             # Send SIGKILL (force)
kill -15 PID            # Send SIGTERM (explicit)
kill -SIGTERM PID       # Named signal
kill -l                 # List all signals
```

**Best practice:** Try SIGTERM first, SIGKILL if unresponsive.

### killall - Kill by Process Name

```bash
killall nginx           # Kill all nginx processes
killall -9 python       # Force kill all python processes
killall -u username     # Kill user's processes
killall -i firefox      # Interactive confirmation
```

### pkill - Pattern-Based Kill

```bash
pkill firefox           # Kill by name pattern
pkill -u user python    # Kill user's python processes
pkill -f "script.py"    # Match full command line
```

## Background and Foreground

### Running in Background

```bash
command &               # Start in background
nohup command &         # Ignore hangup signal
```

### Job Control

```bash
jobs                    # List background jobs
fg %1                   # Bring job 1 to foreground
bg %1                   # Resume job 1 in background
Ctrl+Z                  # Suspend foreground process
```

## Process Priority

### nice - Start with Priority

Priority ranges: -20 (highest) to 19 (lowest), default is 0.

```bash
nice -n 10 command      # Start with lower priority
nice -n -5 command      # Higher priority (requires root)
```

### renice - Change Priority

```bash
renice 10 -p PID        # Change process priority
renice -n 5 -u username # Change user's processes
```

## Monitoring Resources

### Process-Specific

```bash
ps -p PID -o %cpu,%mem,cmd    # Show CPU/memory for PID
top -p PID                     # Monitor specific process
```

### System-Wide

```bash
uptime                  # Load average
free -h                 # Memory usage
vmstat 1                # System stats every second
iostat                  # CPU and I/O stats
```

## Process Information

### /proc Filesystem

Each process has a directory in `/proc/[PID]/`:

```bash
cat /proc/PID/status      # Process status
cat /proc/PID/cmdline     # Command line
cat /proc/PID/environ     # Environment variables
ls -l /proc/PID/fd        # Open file descriptors
cat /proc/PID/limits      # Resource limits
```

## Finding Processes

### pgrep - Find by Pattern

```bash
pgrep nginx             # Get PIDs of nginx processes
pgrep -u username       # User's processes
pgrep -f "python.*script"  # Match full command
pgrep -l nginx          # Show names with PIDs
```

### pidof - PID of Program

```bash
pidof nginx             # Get all PIDs for nginx
pidof -s nginx          # Single PID only
```

## Debugging Processes

### strace - System Call Trace

```bash
strace command          # Trace system calls
strace -p PID           # Attach to running process
strace -e open command  # Trace specific calls
```

### lsof - List Open Files

```bash
lsof -p PID             # Files opened by process
lsof -u username        # Files opened by user
lsof -i :80             # Processes using port 80
lsof /path/to/file      # Processes using file
```

## Practical Examples

### Find and kill unresponsive process
```bash
ps aux | grep firefox
kill -15 1234
# Wait a few seconds
kill -9 1234  # If still running
```

### Monitor resource-heavy processes
```bash
ps aux --sort=-%mem | head -10    # Top 10 by memory
ps aux --sort=-%cpu | head -10    # Top 10 by CPU
```

### Kill all processes for an application
```bash
killall -15 chrome
# Or
pkill -15 chrome
```

### Restart service gracefully
```bash
kill -HUP $(pidof nginx)
# Or
systemctl reload nginx
```

## Best Practices

1. **Try graceful termination first** (SIGTERM) before force kill (SIGKILL)
2. **Identify the right process** - verify PID before killing
3. **Check for child processes** that might need cleanup
4. **Use systemd** for services when available instead of manual kill
5. **Monitor before killing** - understand why process is problematic
6. **Avoid killing system processes** (PID 1, kernel threads)
7. **Document process issues** for debugging recurring problems
