import { test, expect } from "bun:test"
import "../../lib/register-catalogue"
import { resistorProps } from "@tscircuit/props"
import { Circuit } from "../../lib/RootCircuit"

test("schX unsupported calc expression should report an error and not produce NaN center", () => {
  const expression = "calc(U1.pin1.x - 2mm)"
  const parsed = resistorProps.safeParse({
    name: "R1",
    resistance: "1k",
    footprint: "0603",
    schX: expression,
    schY: "0mm",
  })

  expect(parsed.success).toBe(true)

  const circuit = new Circuit()
  circuit.add(
    <resistor
      name="R1"
      resistance="1k"
      footprint="0603"
      schX={expression}
      schY="0mm"
    />
  )
  circuit.render()

  const schematicComponent = circuit.db.schematic_component.list()[0]
  expect(Number.isNaN(schematicComponent?.center?.x)).toBe(false)
  expect(Number.isNaN(schematicComponent?.center?.y)).toBe(false)

  const invalidPropertyErrors = circuit.db.source_invalid_component_property_error.list()
  expect(invalidPropertyErrors.length).toBeGreaterThan(0)
  expect(invalidPropertyErrors.some(e => e.property_name === "schX")).toBe(true)
})

test("schY unsupported calc expression should report an error and not produce NaN center", () => {
  const expression = "calc(U1.pin1.y + 5mm)"

  const circuit = new Circuit()
  circuit.add(
    <resistor
      name="R2"
      resistance="10k"
      footprint="0603"
      schX="10mm"
      schY={expression}
    />
  )
  circuit.render()

  const schematicComponent = circuit.db.schematic_component.list()[0]
  expect(Number.isNaN(schematicComponent?.center?.x)).toBe(false)
  expect(Number.isNaN(schematicComponent?.center?.y)).toBe(false)

  const invalidPropertyErrors = circuit.db.source_invalid_component_property_error.list()
  expect(invalidPropertyErrors.length).toBeGreaterThan(0)
  expect(invalidPropertyErrors.some(e => e.property_name === "schY")).toBe(true)
})
