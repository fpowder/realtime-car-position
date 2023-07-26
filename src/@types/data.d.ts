export type CanAvp = {
	lpn: string,        // 차량 번호판 뒷 4자리
	abnormal: number[], // AVP차량의 이상행동 정보 [과속 주생, 주행중 문열림, 주차중 급발진, 후방 충돌 감지 알람 무시, 사선 주행]
	timestamp: number,  // 데이터 전송 시간의 UTC
}

export type CctvAvp = {
	position: number[], // AVP차량의 그리드 좌표
	abnormal: number[], // AVP차량의 이상행동 정보 [사선 주행, 비 주차공간 주차, 주차선을 밟고 주차]
	alignment_direction: number, // 차량의 틀어진 방향
	alignment_angle: number,  // 주차선 중심 기준 차량이 틀어진 정도
	timestamp: number,
}

export type CctvMonit = {
	num_of_car: number, // ● 주차 통로에서 검출된 차량 수
	'car-coordinate': number[][], // ● 각 차량의 글로벌 x, y 좌표
	num_of_person: number,  // ● 주차 통로에서 검출된 사람 수
	'person-coordinate': number[][],  // ● 사람 객체의 글로벌 x, y 좌표
	'available-parking': number, // ● 주차 가능 공간 수
	parking_space_section: number[], // [0, 0, 3, 0, 2, 0, 0] : 총 7개의 주차구역 중 3번 주차구역에 빈자리가 3개, 5번 주차구역에 빈자리가 2개 있음을 의미
	timestamp: number
}
