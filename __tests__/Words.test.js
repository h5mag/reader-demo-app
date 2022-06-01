import capitalize from '../src/util/Words';

test('changes first character to uppercase', () => {
    expect(capitalize('testproject')).toBe('Testproject');
});
