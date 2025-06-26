import assert from 'node:assert';
import * as cron from '../index.mjs';

describe('Cron', () => {
  describe('validation', () => {
    it('should throw - invalid length', () => {
      assert.throws(() => {
        cron.parseCronExpression('1 2 3');
      }, /Invalid cron pattern: must have exactly 6 parts/);
    });

    it('should throw - number out of bounds', () => {
      assert.throws(() => {
        cron.parseCronExpression('88 2 3 * * *');
      }, /Number out of bounds in part: 88/);
    });

    it('should throw - invalid range (-)', () => {
      assert.throws(() => {
        cron.parseCronExpression('4-10-15 2 3 * * *');
      }, /Invalid range in part: 4-10-15/);
    });

    it('should throw - range out of bounds (-)', () => {
      assert.throws(() => {
        cron.parseCronExpression('8-88 2 3 * * *');
      }, /Range out of bounds in part: 8-88/);
    });
  });

  describe('parseAsterisk (fn)', () => {
    it('should return all values - minute', () => {
      const result = cron.parseAsterisk(0);
      assert.deepEqual(result, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]);
    });

    it('should return all values - hour', () => {
      const result = cron.parseAsterisk(1);
      assert.deepEqual(result, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]);
    });

    it('should return all values - day month', () => {
      const result = cron.parseAsterisk(2);
      assert.deepEqual(result, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]);
    });

    it('should return all values - month', () => {
      const result = cron.parseAsterisk(3);
      assert.deepEqual(result, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    });

    it('should return all values - day month', () => {
      const result = cron.parseAsterisk(4);
      assert.deepEqual(result, [0, 1, 2, 3, 4, 5, 6]);
    });
  })

  describe('parseRange (fn)', () => {
    it('should return range - hour', () => {
      const result = cron.parseRange('2-5', 1);
      assert.deepEqual(result, [2, 3, 4, 5]);
    });
  });

  describe('parseComma (fn)', () => {
    it('should return multiple values - minute', () => {
      const result = cron.parseComma('1,2,3', 0);
      assert.deepEqual(result, [1, 2, 3]);
    });
  });

  describe('parseSteps (fn)', () => {
    it('should return steps for */15', () => {
      const result = cron.parseSteps('*/15', 0);
      assert.deepEqual(result, [0, 15, 30, 45]);
    });

    it('should return steps for 15-30/15', () => {
      const result = cron.parseSteps('15-30/15', 0);
      assert.deepEqual(result, [15, 30]);
    });
  });

  describe('parseCronExpression (fn)', () => {
    it('*/15 0 1,2,3,15 */2 1-5 /usr/bin/find', () => {
      const result = cron.parseCronExpression('*/15 0 1,2,3,15 */2 1-5 /usr/bin/find');
      assert.deepEqual(result, {
        minutes: [0, 15, 30, 45],
        hours: [0],
        days_of_month: [1, 2, 3, 15],
        months: [1, 3, 5, 7, 9, 11],
        days_of_week: [1, 2, 3, 4, 5],
        command: '/usr/bin/find'
      });
    });

    it('0 */2 * * * /usr/bin/find', () => {
      const result = cron.parseCronExpression('0 */2 * * * /usr/bin/find');
      assert.deepEqual(result, {
        minutes: [0],
        hours: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22],
        days_of_month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
        months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        days_of_week: [0, 1, 2, 3, 4, 5, 6],
        command: '/usr/bin/find'
      });
    });
  });
});
