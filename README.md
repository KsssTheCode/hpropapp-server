# <img src="https://github.com/KsssTheCode/hpropapp-server/assets/119558302/688bdcea-0b3c-43ce-9f54-bc8534e911b8" width=50px; height=50px;/>&nbsp;&nbsp;&nbsp;Hpropapp

#### &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : 호텔 자산 관리 시스템&nbsp;&nbsp;<sub>Hotel Property Management System</sub>

<br><br>

## WANNA TEST?!
Visit [Hpropapp](https://hpropapp.com) <br>
테스트 로그인 ID : 230730001<br>
테스트 로그인 PWD : Password!<br>

<br><br>

### 사용 기술<sub>Stack</sub>


-  언어 <sub>Language</sub>&nbsp;&nbsp;:&nbsp;&nbsp;[![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?logo=javascript&logoColor=black&style=flat)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)


-  Client-side&nbsp;&nbsp;:&nbsp;&nbsp;[![HTML](https://img.shields.io/badge/-HTML-E34F26?logo=html5&logoColor=white&style=flat)](https://developer.mozilla.org/en-US/docs/Web/HTML)&nbsp;&nbsp;[![CSS](https://img.shields.io/badge/-CSS-1572B6?logo=css3&logoColor=white&style=flat)](https://developer.mozilla.org/en-US/docs/Web/CSS)&nbsp;&nbsp;[![React.js](https://img.shields.io/badge/-React.js-61DAFB?logo=react&logoColor=black&style=flat)](https://reactjs.org/)&nbsp;&nbsp;[![Redux](https://img.shields.io/badge/-Redux-764ABC?logo=redux&logoColor=white&style=flat)](https://redux.js.org/)


-  Server-side&nbsp;&nbsp;:&nbsp;&nbsp;[![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white&style=flat)](https://nodejs.org/)&nbsp;&nbsp;[![Express](https://img.shields.io/badge/-Express-000000?logo=express&logoColor=white&style=flat)](https://expressjs.com/)&nbsp;&nbsp;[![Sequelize](https://img.shields.io/badge/-Sequelize-41B883?logo=sequelize&logoColor=white&style=flat)](https://sequelize.org/)


-  형상관리<sub>Version Control</sub>&nbsp;&nbsp;:&nbsp;&nbsp;[![GitHub](https://img.shields.io/badge/-GitHub-181717?logo=github&logoColor=white&style=flat)](https://github.com/)&nbsp;&nbsp;[![Git](https://img.shields.io/badge/-Git-F05032?logo=git&logoColor=white&style=flat)](https://git-scm.com/)


-  배포<sub>Deployment</sub>&nbsp;&nbsp;:&nbsp;&nbsp;[![AWS](https://img.shields.io/badge/-AWS-232F3E?logo=amazon-aws&logoColor=white&style=flat)](https://aws.amazon.com/)&nbsp;&nbsp;[![AWS S3](https://img.shields.io/badge/-AWS%20S3-569A31?logo=amazon-aws&logoColor=white&style=flat)](https://aws.amazon.com/s3/)&nbsp;&nbsp;[![AWS Frontcloud](https://img.shields.io/badge/-AWS%20Frontcloud-FF9900?logo=amazon-aws&logoColor=white&style=flat)](https://aws.amazon.com/frontcloud/)&nbsp;&nbsp;[![Amazon RDS](https://img.shields.io/badge/-Amazon%20RDS-FF9900?logo=amazon-aws&logoColor=white&style=flat)](https://aws.amazon.com/rds/)&nbsp;&nbsp;[![Amazon EC2](https://img.shields.io/badge/Amazon%20EC2-Compute%20in%20Cloud-orange?logo=amazon-aws&logoColor=white&style=flat)](https://aws.amazon.com/ec2/)

<br><hr><br>

### 개요

<br>

호텔에서 사용되는 자산관리 시스템으로 객실, 예약에 관한 전반적인 관리 시스템

<br><hr><br>

### 기능

<br>

-  예약관리&nbsp;&nbsp;<img src="https://cdn-icons-png.flaticon.com/128/6459/6459980.png" width=30px; height=30px;/>

| 기능 | 기능설명(특징) | 진행 | 비고 |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ---- |
| 예약 조회 | \* 필터를 이용하여 원하는 조건별로 예약건 조회<br>&nbsp;&nbsp;(키워드, 생성일, 입퇴실일, 객실유형, 요금유형, 생성자, 단체별, ...)<br><br>\* 단체예약 내 개별예약 개별 조회 | <img src="https://cdn-icons-png.flaticon.com/128/6459/6459980.png" width=30px; height=30px;/> | - |
| 예약 생성 | \* 투숙일, 객실유형, 요금유형 입력 시, 자동으로 해당 조건의 지정된 금액 호출(금액 임의설정 가능)<br><br>\* 단체예약 생성 시, 개별예약 투숙일, 객실유형별 일괄 생성 | <img src="https://cdn-icons-png.flaticon.com/128/6459/6459980.png" width=30px; height=30px;/> | - |
| 예약 수정 | \* 예약, 취소, 입실, 퇴실, 퇴실보류 상태로 나누어 관리<br><br>\* 예약이 수정될 시, 관련한 데이터 즉시 업데이트(새로고침 X) | <img src="https://cdn-icons-png.flaticon.com/128/6459/6459980.png" width=30px; height=30px;/> | - |
| 예약 변경기록 | \* 예약건에 대한 모든 수정을 기록(변경자, 변경 전후 내용, 변경일시) | <img src="https://cdn-icons-png.flaticon.com/128/6459/6459980.png" width=30px; height=30px;/> | - |
| 폴리오 생성 | \* 예약건에 대한 폴리오 자동생성 및 관리 | <img src="https://cdn-icons-png.flaticon.com/128/248/248960.png" width=30px; height=30px;/> | - |

<br><br>

-  객실관리&nbsp;&nbsp;<img src="https://cdn-icons-png.flaticon.com/128/248/248960.png" width=30px; height=30px;/>

| 기능 | 기능설명 | 진행 | 비고 |
| --------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ---------- |
| 객실 생성, 수정, 삭제 | | <img src="https://cdn-icons-png.flaticon.com/128/248/248960.png" width=30px; height=30px;/> | 관리자기능 |
| 인디게이터 | \* 실시간으로 투숙중인 객실에 대한 간단한 정보를 하나의 탭에서 확인<br><br>\* 필터를 이용하여 원하는 조건별로 객실정보 조회<br>&nbsp;&nbsp;(키워드, 층별, 객실유형, 정비상태, 객실상태, ...) | <img src="https://cdn-icons-png.flaticon.com/128/248/248960.png" width=30px; height=30px;/> | - |

<br><br>

-  직원관리&nbsp;&nbsp;<img src="https://cdn-icons-png.flaticon.com/128/248/248960.png" width=30px; height=30px;/>

| 기능 | 기능설명 | 진행 | 비고 |
| - | - | - | - |
| 관리자 기능 | \* 기능별로 접근 권한 제한 | <img src="https://cdn-icons-png.flaticon.com/128/248/248960.png" width=30px; height=30px;/> | 관리자기능 |
| 직원 조회 | \* 필터를 이용하여 원하는 조건별로 직원 조회 | <img src="https://cdn-icons-png.flaticon.com/128/248/248960.png" width=30px; height=30px;/> | - |
| 직원 수정 | \* 직원 정보 수정 및 비밀번호 변경 | <img src="https://cdn-icons-png.flaticon.com/128/248/248960.png" width=30px; height=30px;/> | - |
| 직원 퇴사 | \* 직원 퇴사 설정 | <img src="https://cdn-icons-png.flaticon.com/128/248/248960.png" width=30px; height=30px;/> | 관리자 기능 |

<br><br>

-  고객관리&nbsp;&nbsp;<img src="https://cdn-icons-png.flaticon.com/128/7186/7186949.png" width=30px; height=30px;/>

| 기능 | 기능설명 | 진행 | 비고 |
| --------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ---- |
| 고객 조회 | \* 필터를 이용하여 원하는 조건별로 고객 조회 | <img src="https://cdn-icons-png.flaticon.com/128/7186/7186949.png" width=30px; height=30px;/> | - |
| 직원 조회 | \* 필터를 이용하여 원하는 조건별로 직원 조회 | <img src="https://cdn-icons-png.flaticon.com/128/7186/7186949.png" width=30px; height=30px;/> | - |
| 직원 수정 | _ 직원 정보 수정 및 비밀번호 변경<br><br>_ 직원 퇴사처리(관리자 기능) | <img src="https://cdn-icons-png.flaticon.com/128/7186/7186949.png" width=30px; height=30px;/> | - |
