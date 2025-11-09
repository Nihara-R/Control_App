// Robot kinematics calculations for the 3D simulator
export interface RobotState {
  base: number
  shoulder: number
  elbow: number
  wrist: number
}

export interface Position3D {
  x: number
  y: number
  z: number
}

const LINK_LENGTHS = {
  BASE_HEIGHT: 300,
  SHOULDER_TO_ELBOW: 80,
  ELBOW_TO_WRIST: 70,
  WRIST_TO_TOOL: 50,
}

export function forwardKinematics(state: RobotState): Position3D {
  const baseRad = (state.base * Math.PI) / 180
  const shoulderRad = (state.shoulder * Math.PI) / 180
  const elbowRad = (state.elbow * Math.PI) / 180
  const wristRad = (state.wrist * Math.PI) / 180

  const armAngle = shoulderRad + elbowRad + wristRad

  const shoulder = {
    x: LINK_LENGTHS.SHOULDER_TO_ELBOW * Math.cos(shoulderRad),
    z: LINK_LENGTHS.SHOULDER_TO_ELBOW * Math.sin(shoulderRad),
  }

  const elbow = {
    x: shoulder.x + LINK_LENGTHS.ELBOW_TO_WRIST * Math.cos(shoulderRad + elbowRad),
    z: shoulder.z + LINK_LENGTHS.ELBOW_TO_WRIST * Math.sin(shoulderRad + elbowRad),
  }

  const wrist = {
    x: elbow.x + LINK_LENGTHS.WRIST_TO_TOOL * Math.cos(armAngle),
    z: elbow.z + LINK_LENGTHS.WRIST_TO_TOOL * Math.sin(armAngle),
  }

  return {
    x: wrist.x * Math.cos(baseRad),
    y: wrist.x * Math.sin(baseRad),
    z: wrist.z + LINK_LENGTHS.BASE_HEIGHT,
  }
}

export function calculateTrajectory(start: RobotState, end: RobotState, steps: number): RobotState[] {
  const trajectory: RobotState[] = []

  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    trajectory.push({
      base: start.base + (end.base - start.base) * t,
      shoulder: start.shoulder + (end.shoulder - start.shoulder) * t,
      elbow: start.elbow + (end.elbow - start.elbow) * t,
      wrist: start.wrist + (end.wrist - start.wrist) * t,
    })
  }

  return trajectory
}
