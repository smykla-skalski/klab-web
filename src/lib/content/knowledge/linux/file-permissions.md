# Linux File Permissions

Unix-like systems use a permission model that controls who can read, write, or execute files and directories.

## Permission Types

Each file has three permission types:

- **Read (r)**: View file contents or list directory contents
- **Write (w)**: Modify file contents or add/remove files in directory
- **Execute (x)**: Run file as program or access directory

## Permission Classes

Permissions are assigned to three classes:

- **User (u)**: The file owner
- **Group (g)**: Users in the file's group
- **Others (o)**: Everyone else

## Viewing Permissions

```bash
ls -l file.txt
```

Output:
```
-rwxr-xr-- 1 user group 1234 Jan 30 10:00 file.txt
```

Breaking down `-rwxr-xr--`:
- First character: File type (`-` = regular file, `d` = directory, `l` = symlink)
- Next 3 characters: User permissions (`rwx`)
- Next 3 characters: Group permissions (`r-x`)
- Last 3 characters: Others permissions (`r--`)

## Changing Permissions with chmod

### Symbolic Mode

**Syntax:** `chmod [who][operation][permissions] file`

**Who:**
- `u` = user
- `g` = group
- `o` = others
- `a` = all

**Operations:**
- `+` = add permission
- `-` = remove permission
- `=` = set exact permission

**Examples:**
```bash
chmod u+x script.sh        # Add execute for user
chmod g-w file.txt         # Remove write for group
chmod o=r file.txt         # Set others to read-only
chmod a+r file.txt         # Add read for all
chmod u+rwx,g+rx,o-rwx file.txt  # Multiple changes
```

### Numeric Mode

Permissions are represented as 3-digit octal numbers:

**Permission values:**
- `r` = 4
- `w` = 2
- `x` = 1

**Common combinations:**
- `7` = rwx (4+2+1)
- `6` = rw- (4+2)
- `5` = r-x (4+1)
- `4` = r-- (4)
- `0` = --- (0)

**Examples:**
```bash
chmod 755 script.sh    # rwxr-xr-x
chmod 644 file.txt     # rw-r--r--
chmod 700 private.sh   # rwx------
chmod 600 secrets.txt  # rw-------
chmod 777 public.txt   # rwxrwxrwx (dangerous!)
```

## Changing Ownership

### chown - Change Owner
```bash
chown user file.txt           # Change user
chown user:group file.txt     # Change user and group
chown -R user:group /dir      # Recursive
```

### chgrp - Change Group
```bash
chgrp group file.txt          # Change group
chgrp -R group /dir           # Recursive
```

## Special Permissions

### Setuid (4000)
Run executable with file owner's permissions:
```bash
chmod u+s program
chmod 4755 program
```

### Setgid (2000)
- Files: Run with file group's permissions
- Directories: New files inherit directory's group
```bash
chmod g+s directory
chmod 2755 directory
```

### Sticky Bit (1000)
On directories, only file owner can delete their files:
```bash
chmod +t /tmp
chmod 1777 /tmp
```

## Common Scenarios

### Make script executable
```bash
chmod u+x script.sh
# or
chmod 755 script.sh
```

### Secure private file
```bash
chmod 600 private_key.pem
```

### Web server files
```bash
chmod 644 *.html          # Files readable by all
chmod 755 /var/www/html   # Directory executable for all
```

### Shared directory
```bash
chmod 2775 /shared
chgrp team /shared
```

## Default Permissions

### umask
Controls default permissions for new files:

```bash
umask              # View current umask
umask 022          # Set umask (default: 644 for files, 755 for dirs)
umask 077          # Private by default (600 for files, 700 for dirs)
```

Calculation: `permissions = 666 - umask` (files) or `777 - umask` (directories)

## Best Practices

1. **Principle of least privilege**: Only grant necessary permissions
2. **Avoid 777**: World-writable files are security risks
3. **Protect sensitive files**: Use 600 or 400 for credentials
4. **Executable scripts**: 755 for public, 700 for private
5. **Group collaboration**: Use setgid on shared directories
6. **Regular audits**: Find overly permissive files:
   ```bash
   find / -type f -perm -002 2>/dev/null  # World-writable
   find / -type f -perm -4000 2>/dev/null # Setuid
   ```

## Troubleshooting

**Permission denied errors:**
```bash
ls -l file.txt              # Check permissions
whoami                      # Check your user
groups                      # Check your groups
```

**Cannot execute script:**
```bash
chmod +x script.sh
```

**Web server cannot read files:**
```bash
chmod 644 *.html
chmod 755 /var/www/html
```
