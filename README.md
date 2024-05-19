## 1. 기술 선정

---
### Prisma

`nestjs`와 함께 자주 쓰이는 `TypeORM`과 `Prisma`중에서 고민하다가 `Prisma`를 사용하였습니다.

작은 프로젝트이기에 `Prisma`의 단점중 하나인 복잡한 쿼리의 작성이 어려운 부분이 완화되며, 사용하기 쉽고 직관적이기 때문에 선택하게 되었습니다.

<br>

## 2. 프로젝트 배포

---
선택사항에 프로젝트를 배포하는 것이 있어 `AWS`를 사용하여 배포하였습니다.

<br>

## 3. API 명세

---
스웨거를 참고해 주시길 바랍니다.<br>
swagger url: http://girey-edu/api-docs<br>
base url: http://girey-edu/api

<br>

## 4. 데이터베이스 스키마

---
유저와 게시글 정보를 저장하는 테이블 구조입니다.

유저에게는 `Role`, 게시글에는 `Category` 속성을 만들어 권한을 관리하였습니다.

가독성을 위해 `schema.prisma`파일을 각 테이블마다 분리해 두었습니다.

<br>

## 5. 어드민 계정

---
아래의 정보로 `login`요청을 보내시면 `ADMIN`권한을 가진 계정으로 로그인하실 수 있습니다.
```
{
    "email": "admin@gmail.com",
    "password": "admin"
}
```
<br>
토큰의 만료 기한은 1시간 입니다.