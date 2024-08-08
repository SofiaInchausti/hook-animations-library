import { renderHook } from "@testing-library/react-hooks"
import { beforeEach, describe, it } from "vitest"
import { expect } from "vitest"
import { useWindowsResize } from "../useWindowResize"
import { fireEvent } from "@testing-library/react"

describe('useWindowResize',()=>{
    beforeEach(()=>{
        global.innerHeight=600
        global.innerWidth=1024
    })

    it('should instance window object', () => {
        const { result } = renderHook(() => useWindowsResize())
        expect(result.current).toStrictEqual({ width: 1024, height: 600 })
      })

      it('Should update on windows resize', () => {
        const { result } = renderHook(() => useWindowsResize())
        global.innerWidth = 520
        global.innerHeight = 610
        fireEvent(window, new Event('resize'))
        expect(result.current).toStrictEqual({ width: 520, height: 610 })
      })
    
})