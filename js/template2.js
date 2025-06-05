 
        /**
         * 슬라이더 초기화 함수
         * 슬라이더의 인디케이터와 기본 설정을 초기화합니다
         **/
        function initializeSlider() {
            const slides = document.querySelectorAll('.slide');
            totalSlides = slides.length;
            
            // 전체 슬라이드 수 업데이트
            document.getElementById('totalSlides').textContent = totalSlides;
            
            // 인디케이터 생성
            createIndicators();
            
            // 첫 번째 슬라이드로 설정
            updateSlider();
            
            // 자동 슬라이드 시작 (5초마다)
            startAutoSlide();
            
            // 터치 이벤트 등록
            setupTouchEvents();
        }

        /**
         * 인디케이터 점들을 생성하는 함수
         */
        function createIndicators() {
            const indicatorsContainer = document.getElementById('sliderIndicators');
            indicatorsContainer.innerHTML = ''; // 기존 인디케이터 제거
            
            for (let i = 0; i < totalSlides; i++) {
                const indicator = document.createElement('div');
                indicator.className = 'indicator';
                if (i === 0) indicator.classList.add('active'); // 첫 번째 인디케이터 활성화
                
                // 인디케이터 클릭 이벤트
                indicator.addEventListener('click', function() {
                    goToSlide(i);
                });
                
                indicatorsContainer.appendChild(indicator);
            }
        }

        /**
         * 다음 슬라이드로 이동하는 함수
           **/
        function nextSlide() {
            currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
            updateSlider();
            resetAutoSlide(); // 자동 슬라이드 재시작
        }

        /**
         * 이전 슬라이드로 이동하는 함수
            **/
        function previousSlide() {
            currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
            updateSlider();
            resetAutoSlide(); // 자동 슬라이드 재시작
        }

        /**
         * 특정 슬라이드로 이동하는 함수
         * @param {number} index - 이동할 슬라이드 인덱스
            **/
        function goToSlide(index) {
            currentSlideIndex = index;
            updateSlider();
            resetAutoSlide(); // 자동 슬라이드 재시작
        }

        /**
         * 슬라이더 상태를 업데이트하는 함수
         * 슬라이드 위치, 인디케이터, 카운터를 업데이트합니다
           **/
        function updateSlider() {
            const sliderTrack = document.getElementById('sliderTrack');
            const indicators = document.querySelectorAll('.indicator');
            const currentSlideSpan = document.getElementById('currentSlide');
            
            // 슬라이드 트랙 이동 (translateX 사용)
            const translateX = -currentSlideIndex * 100; // 현재 인덱스 * 100%
            sliderTrack.style.transform = `translateX(${translateX}%)`;
            
            // 인디케이터 업데이트
            indicators.forEach((indicator, index) => {
                if (index === currentSlideIndex) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
            
            // 슬라이드 카운터 업데이트
            currentSlideSpan.textContent = currentSlideIndex + 1;
        }

        /**
         * 자동 슬라이드를 시작하는 함수
          **/
        function startAutoSlide() {
            if (isAutoSliding) {
                slideInterval = setInterval(function() {
                    nextSlide();
                }, 10000); // 5초마다 다음 슬라이드로 이동
            }
        }

        /**
         * 자동 슬라이드를 정지하는 함수
         **/
        function stopAutoSlide() {
            if (slideInterval) {
                clearInterval(slideInterval);
            }
        }

        /**
         * 자동 슬라이드를 재시작하는 함수
         * 사용자가 수동으로 슬라이드를 조작했을 때 호출됩니다
          **/
        function resetAutoSlide() {
            stopAutoSlide();
            setTimeout(function() {
                startAutoSlide();
            }, 5000); // 1초 후 자동 슬라이드 재시작
        }

        /**
         * 터치 이벤트를 설정하는 함수
         * 모바일에서 스와이프 제스처로 슬라이드 조작
          **/
        function setupTouchEvents() {
            const sliderWrapper = document.querySelector('.slider-wrapper');
            let startX = 0;
            let endX = 0;
            let isDragging = false;

            // 터치 시작
            sliderWrapper.addEventListener('touchstart', function(e) {
                startX = e.touches[0].clientX;
                isDragging = true;
                stopAutoSlide(); // 터치 중에는 자동 슬라이드 정지
            });

            // 터치 이동
            sliderWrapper.addEventListener('touchmove', function(e) {
                if (!isDragging) return;
                e.preventDefault(); // 스크롤 방지
            });

            // 터치 종료
            sliderWrapper.addEventListener('touchend', function(e) {
                if (!isDragging) return;
                
                endX = e.changedTouches[0].clientX;
                const difference = startX - endX;
                const threshold = 50; // 최소 스와이프 거리

                if (Math.abs(difference) > threshold) {
                    if (difference > 0) {
                        // 왼쪽으로 스와이프 = 다음 슬라이드
                        nextSlide();
                    } else {
                        // 오른쪽으로 스와이프 = 이전 슬라이드
                        previousSlide();
                    }
                } else {
                    // 스와이프 거리가 부족하면 자동 슬라이드 재시작
                    resetAutoSlide();
                }
                
                isDragging = false;
            });

            // 마우스 이벤트 (데스크톱용)
            sliderWrapper.addEventListener('mouseenter', function() {
                stopAutoSlide(); // 마우스 올렸을 때 자동 슬라이드 정지
            });

            sliderWrapper.addEventListener('mouseleave', function() {
                resetAutoSlide(); // 마우스 벗어났을 때 자동 슬라이드 재시작
            });
        }

        /**
         * 키보드 이벤트로 슬라이더 조작
         * 좌우 화살표 키로 슬라이드 이동
          **/
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                // 모든 모달 찾아서 닫기
                const modals = document.querySelectorAll('.modal');
                modals.forEach(function(modal) {
                    if (modal.style.display === 'block') {
                        modal.style.display = 'none';
                    }
                });
            } else if (event.key === 'ArrowLeft') {
                // 왼쪽 화살표 = 이전 슬라이드
                previousSlide();
            } else if (event.key === 'ArrowRight') {
                // 오른쪽 화살표 = 다음 슬라이드
                nextSlide();
            }
        });

        /**
         * 슬라이드 이미지 클릭 시 확대 보기
         * @param {HTMLElement} slideElement - 클릭된 슬라이드 요소
         **/
        function openSlideModal(slideElement) {
            const modal = document.getElementById('photoModal');
            const modalImg = document.getElementById('modalPhoto');
            const img = slideElement.querySelector('img');
            
            modalImg.src = img.src;  // 클릭된 이미지의 src를 모달에 설정
            modal.style.display = 'block';  // 모달 표시
            
            stopAutoSlide(); // 모달 열렸을 때 자동 슬라이드 정지
            
            // 모달 배경 클릭시 닫기
            modal.onclick = function(event) {
                if (event.target === modal) {
                    closeModal('photo');
                    resetAutoSlide(); // 모달 닫으면 자동 슬라이드 재시작
                }
            };
        }

        /**
         * 기존 사진 모달 열기 함수 수정
         * 슬라이더와 호환되도록 수정
          **/
        function openPhotoModal(imgElement) {
            // 슬라이드 요소인지 확인
            const slideElement = imgElement.closest('.slide');
            if (slideElement) {
                openSlideModal(slideElement);
            } else {
                // 기존 방식 유지 (다른 이미지들용)
                const modal = document.getElementById('photoModal');
                const modalImg = document.getElementById('modalPhoto');
                const img = imgElement.querySelector('img');
                
                modalImg.src = img.src;
                modal.style.display = 'block';
                
                modal.onclick = function(event) {
                    if (event.target === modal) {
                        closeModal('photo');
                    }
                };
            }
        }
 
 // JavaScript 코드 시작 - 웹페이지의 동작을 담당
        
        // 전역 변수들
        let musicPlaying = false;  // 음악 재생 상태를 저장하는 변수
        let petalInterval;         // 꽃잎 생성 간격을 저장하는 변수
        let currentSlideIndex = 0; // 현재 슬라이드 인덱스
        let totalSlides = 0;       // 전체 슬라이드 개수
        let slideInterval;         // 자동 슬라이드 인터벌
        let isAutoSliding = true;  // 자동 슬라이드 상태
        
        /**
         * 페이지 로드 완료 후 실행되는 초기화 함수
         * DOM이 완전히 로드된 후 실행됩니다
         */
        document.addEventListener('DOMContentLoaded', function() {
            // 로딩 화면을 2초 후에 숨기기
            setTimeout(function() {
                const loadingScreen = document.getElementById('loadingScreen');
                loadingScreen.style.opacity = '0';  // 서서히 투명하게
                setTimeout(function() {
                    loadingScreen.style.display = 'none';  // 완전히 숨김
                }, 1000);  // 1초 후 완전히 제거
            }, 2000);  // 2초 후 시작
            
            // 꽃잎 애니메이션 시작
            startPetalAnimation();
            
            // 슬라이더 초기화
            initializeSlider();
        });

        /**
         * 꽃잎 애니메이션을 시작하는 함수
         * 일정 간격으로 꽃잎을 생성하여 화면에 떨어뜨립니다
         */
        function startPetalAnimation() {
            const container = document.getElementById('petalsContainer');
            
            // 5초마다 새로운 꽃잎 생성 (더 은은하게)
            petalInterval = setInterval(function() {
                createPetal(container);
            }, 5000);
            
            // 즉시 첫 번째 꽃잎 생성
            createPetal(container);
        }

        /**
         * 개별 꽃잎을 생성하는 함수
         * @param {HTMLElement} container - 꽃잎을 추가할 컨테이너 요소
         */
        function createPetal(container) {
            const petal = document.createElement('div');  // 꽃잎 요소 생성
            petal.className = 'petal';  // CSS 클래스 추가
            
            // 꽃잎의 랜덤한 시작 위치 설정 (화면 너비 내에서)
            petal.style.left = Math.random() * 100 + '%';
            
            // 꽃잎의 랜덤한 애니메이션 속도 설정 (12초 ~ 20초)
            petal.style.animationDuration = (Math.random() * 8 + 12) + 's';
            
            // 컨테이너에 꽃잎 추가
            container.appendChild(petal);
            
            // 애니메이션 완료 후 꽃잎 제거 (메모리 절약)
            setTimeout(function() {
                if (container.contains(petal)) {
                    container.removeChild(petal);
                }
            }, 25000);  // 25초 후 제거
        }

        /**
         * 모달창을 여는 함수
         * @param {string} modalType - 열 모달의 타입
         */
        function openModal(modalType) {
            const modal = document.getElementById(modalType + 'Modal');
            modal.style.display = 'block';  // 모달 표시
            
            // 모달 배경 클릭시 닫기 이벤트 추가
            modal.onclick = function(event) {
                if (event.target === modal) {
                    closeModal(modalType);
                }
            };
        }

        /**
         * 모달창을 닫는 함수
         * @param {string} modalType - 닫을 모달의 타입
         */
        function closeModal(modalType) {
            const modal = document.getElementById(modalType + 'Modal');
            modal.style.display = 'none';  // 모달 숨김
        }

        /**
         * 사진 확대 모달을 여는 함수
         * @param {HTMLElement} imgElement - 클릭된 이미지 요소
         */
        function openPhotoModal(imgElement) {
            const modal = document.getElementById('photoModal');
            const modalImg = document.getElementById('modalPhoto');
            const img = imgElement.querySelector('img');
            
            modalImg.src = img.src;  // 클릭된 이미지의 src를 모달에 설정
            modal.style.display = 'block';  // 모달 표시
            
            // 모달 배경 클릭시 닫기
            modal.onclick = function(event) {
                if (event.target === modal) {
                    closeModal('photo');
                }
            };
        }

        /**
         * 음악 재생/정지를 토글하는 함수
         */
        function toggleMusic() {
            const music = document.getElementById('backgroundMusic');
            const musicBtn = document.getElementById('musicControl');
            
            if (musicPlaying) {
                music.pause();
                musicBtn.textContent = '♪';  // 음악 아이콘
                musicPlaying = false;
            } else {
                music.play().catch(function(error) {
                    console.log('음악 재생 실패:', error);
                    alert('음악 파일을 찾을 수 없습니다.');
                });
                musicBtn.textContent = '⏸';  // 일시정지 아이콘
                musicPlaying = true;
            }
        }

        /**
         * 방명록에 새로운 메시지를 추가하는 함수 기존 
         */
        // function addMessage() {
        //     const nameInput = document.getElementById('guestName');
        //     const messageInput = document.getElementById('guestMessage');
        //     const messagesList = document.getElementById('messagesList');
            
        //     const name = nameInput.value.trim();      // 이름 입력값
        //     const message = messageInput.value.trim(); // 메시지 입력값
            
        //     // 입력값 검증
        //     if (!name || !message) {
        //         alert('이름과 메시지를 모두 입력해주세요.');
        //         return;
        //     }
            
        //     // 새로운 메시지 요소 생성
        //     const messageItem = document.createElement('div');
        //     messageItem.className = 'message-item';
            
        //     // 현재 날짜 생성
        //     const today = new Date();
        //     const dateString = today.getFullYear() + '.' + 
        //                      String(today.getMonth() + 1).padStart(2, '0') + '.' + 
        //                      String(today.getDate()).padStart(2, '0');
            
        //     // 메시지 HTML 구성
        //     messageItem.innerHTML = `
        //         <div class="message-author">${name}</div>
        //         <div class="message-content">${message}</div>
        //         <div class="message-date">${dateString}</div>
        //     `;
            
        //     // 메시지 목록의 맨 앞에 추가
        //     messagesList.insertBefore(messageItem, messagesList.firstChild);
            
        //     // 입력 필드 초기화
        //     nameInput.value = '';
        //     messageInput.value = '';
            
        //     // 성공 알림
        //     alert('축하 메시지가 등록되었습니다!');
        // }

       





        /**
         * 청첩장을 카카오톡으로 공유하는 함수
         */
        function shareInvitation() {
            alert('카카오톡 공유 기능입니다!\n실제 개발에서는 카카오톡 API를 연동합니다.');
        }

        /**
         * 청첩장 링크를 클립보드에 복사하는 함수
         */
        function copyLink() {
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(function() {
                alert('청첩장 링크가 복사되었습니다!');
            }).catch(function() {
                alert('링크 복사에 실패했습니다.');
            });
        }

        /**
         * 지도 앱을 여는 함수
         */
        function openMap() {
            alert('지도 앱을 연결합니다!\n실제 개발에서는 지도 API를 연동합니다.');
        }

        /**
         * 주소를 클립보드에 복사하는 함수
         */
        function copyAddress() {
            const address = '서울특별시 중구 세종대로 172 아름다운 광화문 B2 로스덴웨홀';
            navigator.clipboard.writeText(address).then(function() {
                alert('주소가 복사되었습니다!');
            }).catch(function() {
                alert('주소 복사에 실패했습니다.');
            });
        }

        /**
         * 신랑에게 전화하는 함수
         */
        function callGroom() {
            window.location.href = 'tel:010-1234-5678';
        }

        /**
         * 신부에게 전화하는 함수
         */
        function callBride() {
            window.location.href = 'tel:010-9876-5432';
        }

        /**
         * 계좌번호를 클립보드에 복사하는 함수
         * @param {string} type - 복사할 계좌 타입
         */
        function copyAccount(type) {
            let accountInfo;
            
            if (type === 'groom') {
                // 신랑 계좌번호
                accountInfo = '국민은행 123-456-789012 최재민';
            } else if (type === 'bride') {
                // 신부 계좌번호
                accountInfo = '신한은행 987-654-321098 서미숙';
            }
            
            // 클립보드에 복사
            navigator.clipboard.writeText(accountInfo).then(function() {
                alert('계좌번호가 복사되었습니다!\n' + accountInfo);
            }).catch(function() {
                alert('계좌번호 복사에 실패했습니다.');
            });
        }

        /**
         * 오늘 하루 보지 않기 기능
         */
        function todayPass() {
            alert('오늘 하루 동안 초대장을 보지 않습니다.\n내일 다시 확인해주세요!');
        }

        /**
         * 키보드 이벤트 처리
         * ESC 키를 누르면 열린 모달을 닫습니다
         * 좌우 화살표 키로 슬라이드를 조작합니다
         */
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                // 모든 모달 찾아서 닫기
                const modals = document.querySelectorAll('.modal');
                modals.forEach(function(modal) {
                    if (modal.style.display === 'block') {
                        modal.style.display = 'none';
                        resetAutoSlide(); // 모달 닫으면 자동 슬라이드 재시작
                    }
                });
            } else if (event.key === 'ArrowLeft') {
                // 왼쪽 화살표 = 이전 슬라이드
                previousSlide();
            } else if (event.key === 'ArrowRight') {
                // 오른쪽 화살표 = 다음 슬라이드
                nextSlide();
            }
        });

        /**
         * 스크롤 이벤트 처리
         * 스크롤할 때마다 추가 꽃잎 생성 (매우 은은하게)
         */
        let lastScrollTime = 0;
        window.addEventListener('scroll', function() {
            const now = Date.now();
            // 스크롤 이벤트가 너무 자주 발생하지 않도록 제한 (1초 간격)
            if (now - lastScrollTime > 1000) {
                lastScrollTime = now;
                
                // 스크롤시 추가 꽃잎 생성 (매우 낮은 확률)
                const container = document.getElementById('petalsContainer');
                if (Math.random() > 0.9) {  // 10% 확률로 꽃잎 생성
                    createPetal(container);
                }
            }
        });

        /**
         * 이미지 로드 에러 처리
         * 이미지가 로드되지 않을 때 대체 이미지나 메시지 표시
         */
        document.addEventListener('DOMContentLoaded', function() {
            const images = document.querySelectorAll('img');
            images.forEach(function(img) {
                img.addEventListener('error', function() {
                    // 이미지 로드 실패시 대체 텍스트로 변경
                    this.style.display = 'none';
                    const placeholder = document.createElement('div');
                    placeholder.style.cssText = `
                        width: 100%; 
                        height: 100%; 
                        background: linear-gradient(45deg, #f5f5f5, #e5e5e5);
                        display: flex; 
                        align-items: center; 
                        justify-content: center;
                        color: #999;
                        font-size: 12px;
                        border-radius: 8px;
                        font-family: inherit;
                    `;
                    placeholder.textContent = '사진을 준비중입니다';
                    this.parentNode.appendChild(placeholder);
                });
            });
        });

        /**
         * 페이지 가시성 변경 처리
         * 사용자가 다른 탭으로 이동했다가 돌아올 때 환영 효과
         */
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                // 페이지가 다시 보여질 때 은은한 환영 효과
                const container = document.getElementById('petalsContainer');
                // 연속으로 2개의 꽃잎만 생성
                for (let i = 0; i < 2; i++) {
                    setTimeout(function() {
                        createPetal(container);
                    }, i * 500);  // 500ms 간격으로 생성
                }
            }
        });

        /**
         * 성능 모니터링
         * 페이지 로딩 성능 측정 및 로그
         */
        window.addEventListener('load', function() {
            // 페이지 로딩 완료 시간 측정
            const loadTime = performance.now();
            console.log('페이지 로딩 완료:', Math.round(loadTime) + 'ms');
            
            // 메모리 사용량 확인 (Chrome에서만 지원)
            if ('memory' in performance) {
                console.log('메모리 사용량:', {
                    used: Math.round(performance.memory.usedJSHeapSize / 1048576) + 'MB',
                    total: Math.round(performance.memory.totalJSHeapSize / 1048576) + 'MB'
                });
            }
        });

        /**
         * 터치 제스처 지원 (모바일)
         * 스와이프 제스처로 사진 네비게이션
         */
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', function(event) {
            touchStartX = event.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', function(event) {
            touchEndX = event.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                // 스와이프 감지 시 은은한 꽃잎 효과
                const container = document.getElementById('petalsContainer');
                createPetal(container);
            }
        }

        /**
         * 스무스 스크롤 구현
         * 앵커 링크 클릭 시 부드러운 스크롤
         */
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        /**
         * 인터섹션 옵저버로 애니메이션 최적화
         * 화면에 보이는 요소만 애니메이션 실행
         */
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // 관찰할 요소들 등록
        document.addEventListener('DOMContentLoaded', function() {
            const animateElements = document.querySelectorAll('.info-card, .photo-item, .message-item');
            animateElements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(el);
            });
        });

        // 개발자 도구에서 사용할 수 있는 디버깅 함수들
        window.debugInvitation = {
            // 모든 꽃잎 제거
            clearPetals: function() {
                const container = document.getElementById('petalsContainer');
                container.innerHTML = '';
            },
            
            // 꽃잎 생성 테스트
            testPetals: function(count = 5) {
                const container = document.getElementById('petalsContainer');
                for (let i = 0; i < count; i++) {
                    setTimeout(() => createPetal(container), i * 200);
                }
            },
            
            // 모든 모달 닫기
            closeAllModals: function() {
                const modals = document.querySelectorAll('.modal');
                modals.forEach(modal => modal.style.display = 'none');
            },
            
            // 성능 정보 출력
            getPerformanceInfo: function() {
                return {
                    loadTime: Math.round(performance.now()) + 'ms',
                    memory: 'memory' in performance ? {
                        used: Math.round(performance.memory.usedJSHeapSize / 1048576) + 'MB',
                        total: Math.round(performance.memory.totalJSHeapSize / 1048576) + 'MB'
                    } : 'Not supported'
                };
            },
            
            // 슬라이더 디버깅 함수들
            slider: {
                // 특정 슬라이드로 이동
                goTo: function(index) {
                    if (index >= 0 && index < totalSlides) {
                        goToSlide(index);
                    } else {
                        console.log('Invalid slide index. Range: 0-' + (totalSlides - 1));
                    }
                },
                
                // 자동 슬라이드 토글
                toggleAuto: function() {
                    isAutoSliding = !isAutoSliding;
                    if (isAutoSliding) {
                        startAutoSlide();
                        console.log('Auto slide enabled');
                    } else {
                        stopAutoSlide();
                        console.log('Auto slide disabled');
                    }
                },
                
                // 슬라이더 상태 정보
                getInfo: function() {
                    return {
                        currentIndex: currentSlideIndex,
                        totalSlides: totalSlides,
                        isAutoSliding: isAutoSliding
                    };
                }
            }
        };

        console.log('웨딩 청첩장이 로드되었습니다.');
        console.log('디버깅 명령어: window.debugInvitation');
        console.log('슬라이더 디버깅: window.debugInvitation.slider');
