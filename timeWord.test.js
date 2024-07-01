const { convertTimeString } = require('./timeWord'); 

describe('Time Conversion', () => {
  test('Converts midnight', () => {
    expect(convertTimeString('00:00')).toBe('midnight');
  });

  test('Converts twelve twelve am', () => {
    expect(convertTimeString('00:12')).toBe('twelve twelve am');
  });

  test('Converts one o\'clock am', () => {
    expect(convertTimeString('01:00')).toBe('one o\'clock am');
  });

  test('Converts six oh one am', () => {
    expect(convertTimeString('06:01')).toBe('six oh one am');
  });

  test('Converts six ten am', () => {
    expect(convertTimeString('06:10')).toBe('six ten am');
  });

  test('Converts six eighteen am', () => {
    expect(convertTimeString('06:18')).toBe('six eighteen am');
  });

  test('Converts six thirty am', () => {
    expect(convertTimeString('06:30')).toBe('six thirty am');
  });

  test('Converts ten thirty four am', () => {
    expect(convertTimeString('10:34')).toBe('ten thirty four am');
  });

  test('Converts noon', () => {
    expect(convertTimeString('12:00')).toBe('noon');
  });

  test('Converts twelve oh nine pm', () => {
    expect(convertTimeString('12:09')).toBe('twelve oh nine pm');
  });

  test('Converts eleven twenty three pm', () => {
    expect(convertTimeString('23:23')).toBe('eleven twenty three pm');
  });
});
