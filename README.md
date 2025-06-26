# cron

## how to use

```
import { parseCronExpression } form '...'; // npm name not reserved

const cron = parseCronExpression('0 0 * * * /path/to/script.sh'); 
console.log(cron); // {
  "minutes": [0],
  "hours": [0],
  "days_of_month": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
  "months": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  "days_of_week": [0, 1, 2, 3, 4, 5, 6],
  "command": "/path/to/script.sh"
}
```

## info

this project has not been published to npm yet, so you need to use `npm link` to use it in your project.

the project was NOT built with use of any LLM
