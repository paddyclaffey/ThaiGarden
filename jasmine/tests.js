/// <reference path="Scripts/jasmine.js" />

describe("A basic suite example", function () {

    it("tests the add functionality", function () {
        var sum = 0.1 + 0.1 +0.1;
        expect(sum).toBe(.3);
    });
});