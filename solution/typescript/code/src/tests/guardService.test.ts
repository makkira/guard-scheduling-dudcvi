import { CreateGuard, DeleteGuard, guards } from "../services/guardService";

const mockGuard = { Name: "John Doe", HasArmedCredentials: false };

describe("GuardService", () => {
  describe("CreateGuard", () => {
    it("should add a new guard to the list of guards", () => {
      CreateGuard(mockGuard);

      // Check that the guards array has one element
      expect(guards.length).toBe(1);

      // Check that the guards array contains the newly created guard
      expect(guards[0]).toEqual(mockGuard);
    });
  });

  describe("DeleteGuard", () => {
    it("should remove an existing guard from the list of guards", () => {
      DeleteGuard(mockGuard.Name);

      expect(guards.length).toBe(0);
    });

    it("should throw an error if the guard does not exist", () => {
      expect(() => DeleteGuard(mockGuard.Name)).toThrow(
        `${mockGuard.Name} not found`
      );
    });
  });
});
