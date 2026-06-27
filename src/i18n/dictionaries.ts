import type { Locale } from "./config";

/** 화면 문구 사전.
 *  ko = 원본(소스 오브 트루스), en = 동일 구조의 영문.
 *  `en: typeof ko`로 타입을 묶어, 키가 빠지면 컴파일 단계에서 잡힌다.
 *
 *  ⚠️ en 값 중 일부는 공식 원고 확정 전 임시(draft)다. 사용자가 영문 원고를 주면 교체한다.
 *  아직 영문화하지 않은 섹션(SubscribeSection / InquirySection 등)은 추후 키를 추가한다. */

const ko = {
  intro: {
    cta: "자세히 보기",
    subs: [
      "길 위에서 사람과 지역, 자연을 잇고 지속가능한 걷기문화를 만듭니다",
      "걷는 길이 행복한 이야기가 되는 곳, 대한민국 걷기 문화의 중심",
      "길을 내는 마음보다, 길을 지키는 진심으로 길을 보듬습니다.",
    ],
  },
  ourWay: {
    hero: {
      title: "길, 그 이상의 연결",
      lines: ["단순한 이동을 넘어,", "길 위에 숨겨진 가치를 연결하는 여정이 시작되는 지점"],
    },
    mission: {
      headline: ["길 위에서 사람과 지역, 자연을 잇고", "지속가능한 걷기문화를 만듭니다."],
      desc: [
        "한국의길과문화는 단순히 길을 관리하는 곳이 아니라 이야기와 문화가 숨쉬는 길을 통해 지역경제를 활성화하고,",
        "생태계를 보전하며, 탐방객에게 치유와 배움을 제공하여 지속 가능한 탐방 문화를 일구겠다는 존재 이유로 설립되었습니다.",
      ],
      circles: [
        ["좋은 길을 찾고", "길에 문화와 이야기를 입혀", "길에 숨을 불어 넣는다."],
        ["길위에서", "사람과 지역, 자연을 연결하여", "지속가능한 사회적 가치를 창출한다."],
        ["길을 통해 치유와 배움 등을", "제공하여 창조적 걷기 여행 문화를", "만들고 길의 이용을 활성화한다."],
      ],
    },
    vision: {
      headline: ["걷는 길이 행복한 이야기가 되는 곳,", "대한민국 걷기 문화의 중심"],
    },
    coreValue: [
      { eyebrow: "Discovery", title: "발견", sub: "모든 길에는 이야기가 흐른다", desc: "길 위의 숨은 역사와 문화를 찾아\n매력적인 콘텐츠로 만듭니다." },
      { eyebrow: "Connection", title: "연결", sub: "길은 사람과 지역을 잇는 다리다", desc: "지역과 사람, 자연과 여행자를\n따뜻한 유대감으로 잇습니다." },
      { eyebrow: "Sustainability", title: "지속", sub: "오늘의 길이 내일에도 이어지도록", desc: "자연 생태계를 보전하고 지역 경제를 살려\n내일의 길을 지켜나갑니다." },
      { eyebrow: "Trust", title: "신뢰", sub: "안심하고 걷는 길, 믿음으로 쌓는 문화", desc: "누구나 믿고 걸을 수 있도록 체계적인 관리와\n운영의 전문성을 갖춥니다." },
    ],
    history: {
      subtitle: "우리가 걸어온 길",
      intro: [
        "출범 이후 지난 십여년간 걷기여행길에 문화를 입히고 지속가능한 걷기여행길과",
        "올바른 걷기문화를 위한 방향을 제시하며 다양한 활동을 해왔습니다.",
        "",
        "대한민국을 대표하는 코리아둘레길, 경기둘레길을 포함한 다양한 걷기 길을 지속적으로 연구∙관리·운영하는 가운데,",
        "새로운 걷기 기반 문화 프로그램을 운영하며 걷기 문화 확산을 위한 걸음을 이어가고 있습니다.",
      ],
    },
    people: {
      subtitle: "한국의 길과 문화를 만들어가는 사람들",
    },
    location: {
      subtitle: "새로운 길이 시작되는 곳",
      info: [
        "서울특별시 용산구 한강대로52길 25-8, DB Tower 402호",
        "02-6013-6610",
        "ktnc@tnc.or.kr",
      ],
    },
  },
  sameTrail: {
    hero: {
      title: "같은 길, 다른 시선",
      lines: ["표준을 설계하는 전문성과", "현장의 맥락을 읽는 기획력의 결합"],
    },
    peel: {
      headline: ["길과 지역을 바라보는", "우리의 시선은 조금 남다릅니다."],
      desc: [
        "길은 단순한 선이 아니라, 사람이 걸으며 이야기를 새기는 문화의 길 입니다.",
        "우리는 길을 찾고, 길을 만들며, 길 위에서 세상의 숨결을 읽습니다.",
      ],
    },
    panel: ["기획에서 체험까지,", "길에 이야기를 입히는 걷기길 전문 법인"],
    plan: {
      eyebrow: "길을 짓다",
      title: "기획과 설계의 시선",
      subtitle: "사람·자연·지역을 잇는 걷기길의 구조와 철학을 함께 설계 합니다.",
      body1: ["코리아둘레길, 경기둘레길을 비롯해", "지역의 길을 조사·발굴하고, 사람과 지역을 연결하고,", "자연과 문화가 함께 숨 쉬는 길을 만들어 갑니다."],
      body2: ["구조와 동선을 넘어,", "지역의 미래와 일상의 발걸음을", "함께 그리는 지속가능한 길의 설계자입니다."],
    },
    analysis: {
      eyebrow: "길을 보다",
      title: "관점과 해석의 시선",
      subtitle: "길을 풍경이 아닌 이야기와 철학으로 읽어냅니다.",
      body1: ["묻혀있던 지역의 원석을 찾아 기록하고", "길 위에 새로운 숨결을 불어넣어", "문화라는 생명력을 더합니다."],
      body2: ["같은 길이라도 누구의 눈으로 보느냐에 따라", "전혀 다른 역사와 이야기가 펼쳐집니다.", "길은 단순한 경로가 아니라,", "그 위에 쌓인 시간과 이야기입니다"],
      body3: ["길 위의 자원, 지역문화, 사람의 시간을 읽어내어,", "걷기길을 하나의 인문·문화 텍스트로 해석합니다."],
    },
    experience: {
      eyebrow: "길을 걷다",
      title: "경험과 체험의 시선",
      subtitle: "걷는 사람에게 남다른 경험을 선물하는 길 위의 인문 산책",
      body1: ["우리는 지역의 색과 이야기를 담은 프로그램을 통해,", "사람들이 길 위에서 만나는 감동의 순간을 이어갑니다."],
      body2: ["한 걸음마다 배우고, 위로받고, 연결되는", "걷기여행의 사회적 가치를 만들어갑니다."],
      body3: ["청소년여행문화학교, 지역 특화 걷기프로그램,", "치유와 배움의 프로그램으로", "길 위의 시간을 특별한 경험으로 채웁니다."],
    },
  },
  thePathWeWalk: {
    hero: {
      title: "우리가 걷는 길",
      lines: ["길을 내는 마음보다,", "길을 지키는 진심으로 길을 보듬습니다."],
    },
    sectionLabel: "우리가 걷는 길",
    koriaDulegil: {
      title: "코리아둘레길",
      tabs: [
        {
          name: "코리아둘레길",
          blocks: [
            { h: "코리아둘레길은", lines: ["동・서・남해안 및 DMZ 접경지역 등 우리나라 외곽을", "하나로 연결하는 4,500km에 이르는 ’초장거리 걷기 여행길‘입니다.", "대한민국을 재발견하며, 함께 걷는 길’을 비전으로 탄생한", "코리아둘레길은 삼면의 독특한 해안 경관과 주요 도시,", "DMZ를 체험하며 걸을 수 있어 우리 국토의 아름다움을", "느낄 수 있는 대한민국 대표 여행길입니다."] },
            { h: "코리아둘레길의 통합관리·운영", lines: ["코리아둘레길의 통합관리·운영을 통해", "노선 관리, 안전점검 , 정보 제공, 이용자 경험 개선 등", "전반적인 운영 체계를 구축하고 통합적인 운영관리를 통해", "지속가능한 걷기길을 만들어 나가고 있습니다."] },
          ],
        },
        {
          name: "지킴이 운영",
          blocks: [
            { h: "코리아둘레길 지킴이는", lines: ["코리아둘레길을 직접 걸으며 길의 상태를 점검하고, 안내리본 설치", "및 시설물 이상 여부를 확인하는 현장 중심의 관리 활동입니다.", "코리아둘레길의 해파랑길, 남파랑길, 서해랑길, DMZ평화의길", "전 구간을 대상으로 길의 연결성과 안전성을 유지하고, 여행자가", "보다 편안하게 길을 이용할 수 있도록 지원하는 역할을 수행합니다."] },
            { h: "현장기반 상시 점검 체계", lines: ["코리아둘레길 지킴이 운영을 통해 현장 기반의", "상시 점검체계를 구축하고 있습니다.", "지킴이 활동을 통해 수집된 현장 정보를 바탕으로 노선 정비,", "시설물 개선, 안내체계 보완 등을 지속적으로 추진하고 있으며,", "체계적인 교육과 관리·운영을 통해 길의 품질을 유지하고", "걷기여행 경험을 향상시키고 있습니다."] },
          ],
        },
        {
          name: "길 모니터링",
          blocks: [
            { h: "길 모니터링은", lines: ["지킴이 활동을 통해 접수된 신고내용과 안내사무국으로 접수된", "이용자 의견을 바탕으로 현장점검을 실시하는 관리 활동입니다.", "노선 훼손, 시설물 이상, 안내 오류, 통행 불편 구간 등을 직접 확인하여", "실제 이용 환경에서 발생하는 문제를 점검하고", "개선하기 위한 역할을 수행합니다."] },
            { h: "체계적인 소통과 현장 대응", lines: ["체계적인 신고 접수 및 현장점검 체계를 기반으로 길 모니터링을", "운영하고 있습니다. 지킴이와 여행자로부터 수집된 정보를 바탕으로", "신속한 현장 대응을 실시하고, 점검 결과를 반영하여 시설물 정비,", "노선 보완, 안내정보 개선 등 후속 조치를 지속적으로 추진하고 있습니다."] },
          ],
        },
        {
          name: "찾아가는 교육",
          blocks: [
            { h: "찾아가는 교육은", lines: ["각 지자체 담당자의 코리아둘레길 사업 이해도가 상이한 점을", "고려하여, 교육이 필요한 지자체의 신청을 받아 직접 현장을 방문해", "교육을 제공하는 지원 프로그램입니다.", "코리아둘레길의 사업 개요, 운영 방향, 관리 기준 등을 공유하여", "지자체 담당자의 이해도를 높이고,", "원활한 사업 추진을 돕는 것을 목적으로 합니다."] },
            { h: "현장 맞춤형 교육", lines: ["지자체 대상 찾아가는 교육을 통해 코리아둘레길의", "통합적인 운영 방향과 관리 기준을 체계적으로 컨설팅하고 있습니다.", "현장 맞춤형 교육을 통해 실무 이해도를 제고하고,", "지자체와의 협력체계를 강화하여 사업의 일관성과 실행력을", "높여가고 있습니다."] },
          ],
        },
        {
          name: "쉼터",
          blocks: [
            { h: "코리아둘레길 쉼터는", lines: ["코리아둘레길 여행의 시작과 휴식을 함께하는 거점 공간으로,", "길을 걷다 잠시 쉬어가고 싶은 여행자부터 코리아둘레길 완주에", "도전하는 여행자까지 누구나 이용할 수 있는 열린 공간입니다.", "전 권역에 걸쳐 균형 있게 조성된 쉼터에서는 걷기 정보 제공,", "구간 추천, 지역 연계 프로그램 등 다양한 서비스를 통해", "이용자의 편의를 지원하고 있습니다."] },
            { h: "지역과 길을 연결하는 거점", lines: ["코리아둘레길 쉼터 운영 활성화를 위한 컨설팅을 통해 공간 활용도와", "프로그램 운영의 실효성을 높이고 있습니다.", "쉼터별 특성과 이용 수요를 반영한 운영 방안을 제시하고,", "프로그램 기획 및 운영 방향 개선을 지원함으로써", "쉼터가 단순 휴식 공간을 넘어 지역과 길을 연결하는 거점으로", "기능할 수 있도록 하고 있습니다."] },
          ],
        },
        {
          name: "안내사무국",
          blocks: [
            { h: "코리아둘레길 안내사무국은", lines: ["코리아둘레길 여행자를 대상으로 길 안내, 이용 정보 제공,", "민원 응대 등을 수행하는 운영 지원 창구입니다.", "전화, 두루누비 등을 통해 접수되는 다양한 문의와 의견을 바탕으로", "이용자의 불편사항을 해소하고, 보다 안전하고 편리한 걷기 환경을", "제공하는 역할을 수행합니다."] },
            { h: "이용자 중심의 소통", lines: ["코리아둘레길 안내사무국 운영을 통해 이용자 중심의 소통 체계를", "구축하고 있습니다. 접수된 문의 및 민원 사항을 체계적으로", "관리하고, 필요한 경우 관계기관 및 현장과 연계하여 신속한 대응이", "이루어질 수 있도록 지원하고 있으며, 이를 바탕으로 노선 및 운영", "개선에 반영하는 선순환 체계를 만들어가고 있습니다."] },
          ],
        },
      ],
    },
    regional: {
      title: "지역길 조사 및 연구",
      tabs: [
        {
          name: "경기둘레길 통합관리운영",
          blocks: [
            { h: "경기둘레길은", lines: ["경기도 전역을 순환하는 총연장 약 860km의 장거리 걷기길로,", "15개 시·군을 연결하는 경기도 대표 걷기여행길입니다.", "해안, 산림, 하천, 도심 등 다양한 자연환경과", "지역의 역사·문화를 따라 걷는 여정을 통해", "경기도의 다채로운 풍경과 이야기를 경험할 수 있습니다."] },
            { h: "경기둘레길 통합관리운영", lines: ["경기둘레길의 체계적인 관리·운영을 통해", "안전하고 쾌적한 걷기 환경을 조성하고 있습니다.", "노선 관리, 시설물 유지보수, 정보 제공, 이용자 경험 개선 등 전반적인", "운영체계를 구축하고 있으며, 자원활동가 및 임도지킴이 운영과 모니터링", "현장 점검을 기반으로 지속가능한 걷기길을 만들어 나가고 있습니다."] },
          ],
        },
        {
          name: "충청남도 종교문화의길 조성 정비 기본계획 수립",
          blocks: [
            { h: "충청남도 종교문화의 길은", lines: ["충청남도 전역에 분포한 천주교, 불교, 유교 등 다양한 종교·역사 자원을", "연결하는 걷기길로, 신앙과 사색, 치유의 여정을 담은", "문화탐방형 트레일입니다.", "각 지역의 성지, 사찰, 향교 등 종교문화 자산과 자연환경을", "함께 경험할 수 있으며, 길을 따라 형성된 역사와 삶의 이야기를 통해", "충청남도의 깊이 있는 문화적 가치를 체감할 수 있습니다."] },
            { h: "체계적인 종합 계획", lines: ["충청남도 종교문화의 길 조성 및 정비 기본계획 수립을 통해 노선 체계", "구축, 콘텐츠 발굴, 운영 방향 설정 등 종합적인 계획을 마련했습니다.", "노선 선정 및 연계성 확보, 안내체계 구축, 프로그램 개발 등 실행 기반을", "체계적으로 설계하여 지속가능한 걷기길로 조성하고,", "지역 관광 활성화와 문화자원 활용을 동시에 도모하고 있습니다."] },
          ],
        },
      ],
    },
    culture: {
      title: "걷기기반 문화 프로그램",
      tabs: [
        {
          name: "청소년여행문화학교",
          blocks: [
            { h: "청소년여행문화학교란", lines: ["청소년이 역사·문화·생태를 아우르는 걷기 여행을 통해 추억을 만들고", "정서적 교감을 나눔으로써,국토와 지역문화의 소중한 의미를 배우고", "삶의 방향성을 모색할 수 있는 계기를 제공하고자", "청소년 여행문화학교를 기획·운영하고 있습니다."] },
            { h: "", lines: ["2010년부터 2016년까지 문화체육관광부가 지원하는", "청소년 대상 사업으로 ‘이야기가 있는 문화생태탐방’ 이란 주제로", "진행하였으며, 2017년부터는 사단법인 한국의길과문화의", "자체적인 사회공헌사업으로 그 가치를 이어가고 있습니다.", "지금까지 2천 여명의 멘토와 멘티가 함께 걸었습니다."] },
          ],
        },
        {
          name: "길이 길이 여행",
          blocks: [
            { h: "", lines: ["가본 길이라도, 같은 지역이라도 색다른 시선으로 다가갈 수 있는", "몰입형 로컬 테마 여행입니다.", "당신의 인생에 길이길이 남을 장면을 선물합니다."] },
            { h: "", lines: ["길은 단순한 이동이 아니라 시간과 삶이 흐르는 공간, 소비가 아니라", "기억과 관계를 남기는 경험,", "관광지가 아니라 사람의 이야기로 완성되는 장소- 길을 걸으며 사람과", "이야기를 만나, 오래도록 남는 여행을 만들어가고 있습니다."] },
          ],
        },
        {
          name: "길동무 프로그램",
          blocks: [
            { h: "든든한 동반자가 함께 걷는 길", lines: ["함께 걷는 순간이 길의 경험을 바꾼다는 데 주목합니다.", "같은 길이라도 누군가와 나누는 걸음은 더 가볍고, 더 깊게 남습니다.", "길동무가 참여자와 동행하며 길 위의 이야기와 순간을 나누고,", "길에 대한 해설과 체험이 결합되어 코스를 보다 깊이 있게", "이해할 수 있습니다."] },
            { h: "", lines: ["혼자일 때보다 덜 힘들고 더 즐거운 걸음 속에서", "사람과 사람, 그리고 길이 자연스럽게 이어지고,", "걷는 시간 자체가 하나의 기억으로 남습니다.", "혼자가 아닌 ‘함께 걷는 길’의 의미를 자연스럽게 만들어갑니다."] },
          ],
        },
        {
          name: "걷기 축제",
          blocks: [
            { h: "참여형 걷기 축제", lines: ["길 위에서 지역의 이야기와 문화를 즐기는 참여형 걷기 축제를", "만들어갑니다. 단순한 축제를 넘어, 걷기 문화를 확산하고", "지역과의 지속적인 연결을 만들어갑니다."] },
            { h: "", lines: ["참여자의 걸음이 로컬 콘텐츠가 유기적으로 연결되어", "지역의 매력에 몰입하고, 길과 지역에 대한 새로운 모습을", "만날 수 있습니다. 걷는 순간마다 새로운 경험이 펼쳐지며,", "사람과 지역이 함께 어우러지는 축제의 장을 만듭니다."] },
          ],
        },
        {
          name: "길 문화 아카이빙",
          blocks: [
            { h: "길과 지역 문화 자산화", lines: ["수년간 현장에서 축적된 길과 지역에 대한 높은 이해를 바탕으로", "길 위에 축적된 역사와 문화, 사람의 이야기를 체계적으로", "수집·기록하고 이를 데이터와 콘텐츠로 탄생시킵니다.", "이렇게 축적된 아카이브는 길의 정체성을 보존하는 동시에,", "다양한 프로그램과 콘텐츠로 확장되어 새로운 길 경험으로 이어집니다."] },
            { h: "", lines: ["현장 조사와 인터뷰, 기록물 수집 등을 통해", "지역 고유의 스토리를 발굴하고, 이를 영상·텍스트·지도 등", "다양한 형태로 구조화합니다. 출판, 프로그램, 디지털 플랫폼 등으로", "바로 연계되어 누구나 접근하고 활용할 수 있도록 확장됩니다."] },
          ],
        },
      ],
    },
    goods: {
      title: "굿즈 기획 및 판매",
      tabs: [
        {
          name: "해파랑길 스탬프북",
          blocks: [
            { h: "해파랑길 스탬프북은", lines: ["동해안을 따라 이어지는 길과 그 안에 담긴 지역의 풍경과 문화를", "새롭게 바라보게 하는 기록 도구입니다.", "코스를 걸으며 하나씩 찍히는 스탬프는 지나온 시간과 순간을", "자연스럽게 남겨주고, 걸음에 소소한 즐거움과 동기를 더합니다.", "해파랑길 스탬프북은 상·하권으로 나뉘어 각 구간의 지리적 흐름과", "지역의 특색을 담아 구성되어 있습니다."] },
            { h: "", lines: ["하권은 강원도의 해안 절경과 자연 중심의 길을 따라 이어지며,", "시원하게 펼쳐진 동해의 풍경과 함께 걷는 경험을 제공합니다.", "상권은 경상도의 해안과 도시, 어촌이 어우러진 길로 이어지며", "지역의 생활과 문화가 보다 가까이 느껴지는 여정을 담고 있습니다."] },
          ],
        },
        {
          name: "코리아둘레길 키링",
          blocks: [
            { h: "길의 흐름과 연결의 상징을 담아낸 오브제", lines: ["실제 로고와 그래픽 요소를 기반으로, 길이 연결되는 구조와 방향성을", "직관적으로 표현했습니다."] },
            { h: "", lines: ["작지만 분명한 형태로 코리아둘레길의 아이덴티티를 드러내며,", "일상 속에서도 길의 기억을 자연스럽게 이어줍니다.", "단순한 기념품이 아닌, 코리아둘레길의 상징과 체계를", "직관적으로 보여주는 아이템으로, 작지만 선명하게 ‘길’을 드러냅니다."] },
          ],
        },
        {
          name: "해로지 키링",
          blocks: [
            { h: "함께 걷는 작은 여행친구", lines: ["길을 따라 걷는 즐거움과 코리아둘레길의 정체성을 친근한 캐릭터로", "풀어내어, 일상 속에서도 자연스럽게 길을 떠올리게 합니다.", "함께 달고 다니는 것만으로도 다시 걷고 싶은 마음을", "불러오는 아이템입니다."] },
          ],
        },
      ],
    },
  },
  ourStories: {
    hero: {
      title: "알리는 이야기",
      lines: ["알리고 나누어 길을 더 풍성하게 합니다."],
    },
  },
  walkWithUs: {
    hero: {
      title: "마음잇기",
      desc: "길 위에 가치를 더하는 여정에 함께하세요.",
    },
    tabs: { donation: "후원하기", annual: "연간기금 및 활동실적 내역" },
    donation: {
      headline: "후원은 길이 다시 살고 빛나게 합니다.",
      desc: ["걷기 길의 지속가능한 발전을 지원해주세요.", "모아주신 후원금은 걷기 길의 지속가능한 발전을 위한 다양한 활동에 사용됩니다."],
      account: "계좌번호",
      accountNo: "농협 301-0061-8049-01",
      holder: "예금주",
      holderName: "사단법인 한국의길과문화",
      note: "일시후원/정기후원 모두 가능",
      usageTitle: "후원금 사용처",
      usage: ["걷기 여행길 조성 및 유지보수", "걷기 여행길 교육&문화 프로그램 운영", "자원봉사 운영등"],
      copyAria: "계좌번호 복사",
      copied: "복사됨",
    },
    annual: { sampleTitle: "코리아둘레길 지킴이 모집" },
  },
  walkingTogether: {
    hero: {
      title: "함께 걷는 사람들",
      lines: ["함께 걸어서 아름다운 길,", "같이 해서 힘이 되는 길을 걷습니다"],
    },
    peel: ["함께 걸어서 아름다운 길,", "같이 해서 힘이 되는 길을 걷습니다."],
    learnMore: "자세히 보기",
    orgs: [
      {
        title: "한국걷는길연합",
        lines: [
          "한국걷는길연합(KTA)은 한국의 도보 여행길을 운영하고 관리하는 단체들의 모임으로,",
          "도보여행을 통해 자연의 소중함을 알리고, 지역문화를 재발견하여 지속 가능한 지역관광 활성화와",
          "공동체 발전을 목표로 활동하는 단체입니다.",
          "사단법인 한국의문화를 포함한 20개에 이르는 걷기 길 단체가 모여",
          "지속가능한 걷기 문화를 만들어 나가고 있습니다.",
        ],
      },
      {
        title: "아시아 트레일즈 네트워크(ATN)",
        lines: [
          "아시아 각국의 트레일을 연결하는 지역 기반 국제 네트워크로, 국가 간 교류와 공동 프로그램을 통해",
          "아시아 트레일의 다양성과 연결성을 강화하는 다양한 사업을 진행하고 있습니다.",
          "사단법인 한국의길과문화는 ATN과 함께 한국의 길을 아시아 맥락 속에서 해석하고,",
          "한국의 길을 아시아와 잇는 역할을 수행하고 있습니다.",
        ],
      },
      {
        title: "월드 트레일즈 네트워크(WTN)",
        lines: [
          "전 세계의 트레일과 걷기길을 연결하는 글로벌 협력 네트워크입니다.",
          "각국의 운영 주체들이 교류하며 트레일 보전과 지속가능한 이용, 걷기 관광의 가치를 함께 만들어가고 있습니다.",
          "한국의길과문화는 WTN과의 협력을 통해 한국의 길을 세계와 연결하고, 그 경험과 콘텐츠를 확장하고 있습니다.",
          "길을 매개로 사람과 자연, 지역을 잇는 글로벌 흐름을 함께 만들어가고 있습니다.",
        ],
      },
      {
        title: "GKO(코리아둘레길 완보자클럽)",
        lines: [
          "코리아둘레길(해파랑길, 남파랑길, 서해랑길, DMZ평화의길) 중 1개 이상을 완주한 사람들이 모인 코리아둘레길 완보자 클럽은",
          "지속 가능한 걷기 여행 문화 확산을 목적으로 2024년 5월 발족한 모임입니다.",
          "4500km 전 구간 완주자(그랜드슬램)를 포함한 회원들이 정보를 교류하며, 단순한 걷기 모임을 넘어",
          "코리아둘레길 관련 행사 및 홍보 활동을 주도하고 있습니다.",
        ],
      },
    ],
  },
  header: {
    home: "한국의길과문화 홈",
    language: "언어 변경",
    nav: {
      ourWay: "우리의 길",
      sameTrail: "같은 길, 다른 시선",
      thePathWeWalk: "우리가 걷는 길",
      walkingTogether: "함께 걷는 사람들",
      ourStories: "알리는 이야기",
      walkWithUs: "마음잇기",
    },
  },
  footer: {
    foundation: "Korean Trails and Culture Foundation",
    cols: [
      { h: "우리의 길", links: ["설립목적", "비전 및 핵심가치", "주요 연혁", "사람들", "오시는 길"] },
      { h: "같은 길, 다른 시선", links: ["전문역량"] },
      { h: "우리가 걷는 길", links: ["코리아둘레길", "지역길 조사 및 계획", "걷기 문화 프로그램", "굿즈 개발 및 판매"] },
      { h: "함께 걷는 사람들", links: ["한국걷는길연합", "ATN", "WTN", "코리아둘레길 완보자 클럽"] },
      { h: "알리는 이야기", links: ["공지사항", "소식받기", "문의하기"] },
      { h: "마음잇기", links: ["후원하기", "연간기금 및 활동 실적내역"] },
    ],
    info: {
      line1: ["대표 : 홍성운", "사업자등록번호 : 123-82-14123"],
      line2: [
        "주소 : 서울특별시 용산구 한강대로52길 25-8, DB Tower 402호",
        "대표전화 : 02-6013-6610",
        "이메일 : ktnc@tnc.or.kr",
      ],
      line3: ["개인정보보호책임자 : 최해선"],
    },
    // 모바일 푸터 전용 줄 구성 (KO는 데스크톱과 동일 내용을 모바일 줄바꿈으로 재현)
    mobileInfo: [
      "대표 : 홍성운  |  사업자등록번호 : 123-82-14123",
      "주소 : 서울특별시 용산구 한강대로52길 25-8, DB Tower 402호",
      "대표전화 : 02-6013-6610  |  이메일 : ktnc@tnc.or.kr",
      "개인정보보호책임자 : 최해선",
    ],
  },
  notices: {
    tabs: {
      notices: "공지사항",
      subscribe: "소식받기",
      comingSoon: "추가될 메뉴",
      contact: "문의하기",
    },
    search: "검색어를 입력해주세요.",
    noticesHeading: ["한국과길과문화의", "새로운 소식을 확인해보세요."],
    comingSoonHeading: ["추가될 게시판", "준비 중입니다."],
    sampleTitle: "코리아둘레길 지킴이 모집",
    sampleBody:
      "게시글의 본문 최대 두 줄까지 노출됩니다. 게시글의 본문 최대 두 줄까지 노출됩니다. 게시글의 본문 최대 두 줄까지 노출됩니다. 게시글의 본문 최대 두 줄까지 노출됩니다. 게시글의 본문 최대 두 줄까지 노출됩니다.",
    sampleDate: "2026.03",
    placeholderTitle: "게시글 제목",
    placeholderBody:
      "게시글의 본문 최대 두 줄까지 노출됩니다. 게시글의 본문 최대 두 줄까지 노출됩니다. 게시글의 본문 최대 두 줄까지 노출됩니다.",
  },
  subscribe: {
    heading: ["한국과길과문화의", "새로운 소식을 보내드려요."],
    labels: { name: "소식 받는 분 성함", phone: "소식 받는 분 연락처", email: "소식 받을 이메일", interests: "관심분야" },
    interests: ["둘레길지킴이", "자원봉사", "걷기문화 프로그램"],
    emailDirect: "직접 입력",
    namePlaceholder: "홍길동",
    emailPlaceholder: "이메일",
    consent: "개인정보 수집 및 활용에 동의합니다.",
    submit: "신청",
    cards: [
      { title: "둘레길지킴이", lines: ["유니크 로컬 체험 ‘길문화학교’, 청소년 멘토링", "걷기여행 ‘청소년여행문화학교’ 등 걷기여행을", "운영하고 있습니다.", "개인은 물론 단체/기업 참여가 가능합니다."] },
      { title: "자원봉사", lines: ["걷기길 관리/운영 봉사활동을 하고 있습니다.", "제초, 정비, 플로깅(환경보호) 등", "우리의 길을 지키기 위한 다양한 활동을", "비정기적 운영하고 있습니다."] },
      { title: "걷기문화 프로그램", lines: ["매년 모집/선발된 둘레길 지킴이 선생님들이", "편안하고 안전한 둘레길 여행을 위해", "각 지역/구간을 정기적 관리하고 있습니다."] },
    ],
  },
  inquiry: {
    heading: ["궁금하신 사항을 남겨주세요.", "빠른 시간 안에 답변 드리겠습니다."],
    labels: { name: "문의하시는 분 성함", email: "답변 받을 이메일", content: "문의내용" },
    emailDirect: "직접 입력",
    namePlaceholder: "홍길동",
    emailPlaceholder: "이메일",
    contentPlaceholder: "문의하시는 내용을 입력해주세요.",
    submit: "보내기",
  },
  noticeDetail: {
    list: "목록",
    prev: "이전 글",
    next: "다음 글",
    title: "코리아둘레길 지킴이 모집",
    date: "2026.03",
    body: `[2026 코리아둘레길 지킴이 모집 안내]

안녕하세요. 한국관광공사에서는 2026년 코리아둘레길의 안전과 편의를 위해 활동해주실 '코리아둘레길 지킴이'를 모집합니다.

접수 및 자세한 내용은 두루누비 공지사항을 확인해주세요.
우리 국토 외곽을 잇는 국내 최장 거리 걷기여행길 '코리아둘레길' 관리에 함께해 주실 분들의 관심과 참여를 기다립니다.`,
    posterAlt: "2026 코리아둘레길 지킴이 모집 포스터",
  },
};

// en: ko와 동일 구조 강제. (draft — 공식 원고 확정 시 교체)
const en: typeof ko = {
  intro: {
    cta: "Learn More",
    subs: [
      "Connecting nature, places, and people through sustainable walking.",
      "Where every trail becomes a story of joy—the heart of Korea’s walking culture.",
      "More than creating trails, we protect and live them.",
    ],
  },
  ourWay: {
    hero: {
      title: "Connecting Beyond Distance",
      lines: ["Beyond a simple journey,", "Where the hidden values along the path truly connect."],
    },
    mission: {
      headline: ["Connecting people, places, and nature through trails—", "and shaping a more sustainable walking culture."],
      desc: [
        "Korea Trails & Culture goes beyond managing trails. We bring them to life—infusing each path",
        "with stories, local identity, and cultural meaning. In doing so, we help revitalize communities,",
        "protect natural environments, and offer walkers moments of reflection, learning, and connection.",
        "Through every journey, we strive to create a walking culture that is both meaningful and sustainable.",
      ],
      circles: [
        ["We discover and curate", "trails, enriching them", "with culture and", "storytelling."],
        ["We connect people,", "communities, and nature", "—creating shared", "and lasting value."],
        ["We design walking", "experiences that inspire", "healing, learning, and deeper", "engagement with the trail."],
      ],
    },
    vision: {
      headline: ["Where every trail becomes a story of joy—", "the heart of Korea’s walking culture."],
    },
    coreValue: [
      { eyebrow: "", title: "Discovery", sub: "Every trail holds a story waiting to be told.", desc: "We uncover the hidden history and cultural richness along each path, transforming them into meaningful and engaging experiences." },
      { eyebrow: "", title: "Connection", sub: "Trails are bridges between people and place.", desc: "We bring together communities, travelers, and nature—\nfostering a sense of belonging and genuine connection." },
      { eyebrow: "", title: "Sustainability", sub: "So the trails of today can be walked tomorrow.", desc: "We protect natural ecosystems and support local economies, ensuring that trails continue to thrive for generations to come." },
      { eyebrow: "", title: "Trust", sub: "Walk with confidence, built on care and expertise.", desc: "Through thoughtful management and professional stewardship, we create trails that everyone can trust and enjoy safely." },
    ],
    history: {
      subtitle: "Our Journey",
      intro: [
        "Over the past decade since our launch, we have brought culture to walking trails and have led",
        "various activities to promote sustainable trails and a healthy walking culture.",
        "",
        "We continue to research, manage, and operate diverse trails including the Korea Dulle-gil and Gyeonggi Dulle-gil,",
        "while developing new walking-based cultural programs to expand the walking culture across Korea.",
      ],
    },
    people: {
      subtitle: "The People Shaping Korea Trails & Culture",
    },
    location: {
      subtitle: "Where New Trails Begin",
      info: [
        "Room 402, DB Tower, 25-8, Hangang-daero 52-gil, Yongsan-gu, Seoul",
        "02-6013-6610",
        "ktnc@tnc.or.kr",
      ],
    },
  },
  sameTrail: {
    hero: {
      title: "Same Trail, New Vision",
      lines: ["Expertise in standard design met", "with context-driven planning skills"],
    },
    peel: {
      headline: ["We see trails—and the places they pass through—", "a little differently."],
      desc: [
        "A trail is not just a line on a map, but a cultural path where stories quietly build with every step.",
        "We discover paths, we create them, and along the way, we tune into the living rhythms",
        "of the world that unfold on the trail.",
      ],
    },
    panel: ["From planning to experience, a trail-focused company", "that brings stories to life along every path."],
    plan: {
      eyebrow: "Shaping the Path",
      title: "A Design Perspective",
      subtitle: "Designing trails with a thoughtful balance of structure and philosophy—connecting people, nature, and place.",
      body1: [
        "We research and develop trails across Korea, including the Korea Dulle-gil",
        "and Gyeonggi Dulle-gil—creating routes where people, communities,",
        "nature, and culture exist in harmony.",
      ],
      body2: [
        "Beyond routes and layouts, we design with a broader perspective—",
        "shaping sustainable trails that reflect both the future of local",
        "communities and the rhythms of everyday life.",
      ],
    },
    analysis: {
      eyebrow: "Seeing the Path",
      title: "A Perspective in Reading",
      subtitle: "We read trails not as scenery, but as stories shaped by time and meaning.",
      body1: [
        "The same path can reveal entirely different histories and narratives,",
        "depending on how it is seen. A trail is not just a route,",
        "but a layered record of time and lived experience.",
      ],
      body2: [
        "We interpret each trail as a cultural and humanistic text—",
        "drawing from local resources, community life,",
        "and the rhythms of those who have walked it.",
      ],
      body3: [
        "By uncovering hidden local gems and documenting their stories,",
        "we breathe new life into the trail—",
        "enriching it with the vitality of culture.",
      ],
    },
    experience: {
      eyebrow: "Walking the Path",
      title: "A Perspective in Engagement",
      subtitle: "Thoughtfully crafted journeys that offer something truly beyond the ordinary",
      body1: [
        "With every step, there is something to learn, to feel, and to connect with—",
        "turning walking into a meaningful and shared experience.",
      ],
      body2: [
        "Through programs shaped by local identity and storytelling,",
        "we create moments on the trail that resonate and stay.",
      ],
      body3: [
        "From youth travel initiatives to locally curated walking programs,",
        "we transform time on the trail into experiences",
        "of learning, healing, and connection.",
      ],
    },
  },
  thePathWeWalk: {
    hero: {
      title: "The Path We Walk",
      lines: ["More than creating trails,", "we protect and live them."],
    },
    sectionLabel: "The Path We Walk",
    koriaDulegil: {
      title: "Korea Dulle-gil",
      tabs: [
        {
          name: "Korea Dulle-gil",
          blocks: [
            { h: "The Korea Dulle-gil is", lines: ["a national long-distance trail that connects the entire Korean Peninsula—linking the East, West, and South coasts and the DMZ into one continuous journey. It offers a unique way to experience Korea's landscapes, history, and local life."] },
            { h: "Integrated Management & Operations", lines: ["We ensure consistency and quality across the national trail network through integrated management. From route maintenance to user experience, we build a system that supports a more sustainable walking culture."] },
          ],
        },
        {
          name: "Rangers",
          blocks: [
            { h: "Korea Dulle-gil Rangers are", lines: ["field-based stewards who walk the trails to monitor conditions, install markers, and check facilities. Covering the entire network, they help ensure connectivity, safety, and a better walking experience."] },
            { h: "Field-Based Monitoring System", lines: ["Through the Ranger program, we maintain an ongoing on-site monitoring system. Field insights support route maintenance, facility improvements, and a high-quality trail experience."] },
          ],
        },
        {
          name: "Monitor Trails",
          blocks: [
            { h: "Trail Monitoring is", lines: ["a field-based management process that verifies issues reported by Rangers and users. We inspect route damage, facility issues, wayfinding errors, and accessibility concerns to improve real on-site conditions."] },
            { h: "Responsive & Connected System", lines: ["Based on a structured reporting and inspection system, we respond quickly to on-site issues. Insights from Rangers and users guide ongoing improvements in maintenance, route conditions, and information systems."] },
          ],
        },
        {
          name: "On-site Training Program",
          blocks: [
            { h: "On-site Training Program is", lines: ["a support program that delivers on-site training to local governments, tailored to their needs and level of understanding. We share key frameworks—project overview, operational direction, and management standards—to support effective implementation."] },
            { h: "Tailored, Field-Based Learning", lines: ["Through customized on-site training, we provide practical guidance on integrated operations and management standards. This approach strengthens collaboration with local partners and enhances consistency and execution across the network."] },
          ],
        },
        {
          name: "Rest Stops",
          blocks: [
            { h: "Korea Dulle-gil Rest Stops", lines: ["Rest stops serve as welcoming hubs along the trail—places to begin, pause, and recharge. Open to all walkers, they offer essential information, route recommendations, and locally connected programs across the network."] },
            { h: "Connecting Trails and Communities", lines: ["Through operational consulting, we enhance how each rest stop is used and experienced. By aligning space, programs, and local context, we help transform rest stops into meaningful connections between trails and communities."] },
          ],
        },
        {
          name: "Information Center",
          blocks: [
            { h: "Korea Dulle-gil Information Center", lines: ["The Information Center serves as a support hub for walkers—providing guidance, travel information, and assistance. Through phone and platforms like Duru Nubi, we respond to inquiries and feedback to ensure a safer and more convenient walking experience."] },
            { h: "User-Centered Communication", lines: ["We operate a structured, user-focused communication system. Feedback is managed systematically and, when needed, connected to relevant teams for prompt response—continuously informing improvements to routes and operations."] },
          ],
        },
      ],
    },
    regional: {
      title: "Trail Research & Planning",
      tabs: [
        {
          name: "Integrated Management & Operations of Gyeonggi Dulle-gil",
          blocks: [
            { h: "Gyeonggi Dulle-gil is", lines: ["a 860 km circular trail across Gyeonggi Province, connecting 15 cities and counties. From coastlines and forests to rivers and urban landscapes, it offers a diverse journey through the region's nature, history, and culture."] },
            { h: "Integrated Management & Operations", lines: ["We create a safe and comfortable walking environment through systematic management. From route maintenance and facilities to user experience, on-site monitoring and volunteer programs support a sustainable trail system."] },
          ],
        },
        {
          name: "Master Plan for the Chungcheongnam-do Religious & Cultural Trail",
          blocks: [
            { h: "Chungcheongnam-do Religious & Cultural Trail", lines: ["A cultural trail that connects diverse religious and historical sites across Chungcheongnam-do—including Catholic, Buddhist, and Confucian heritage. It offers a journey of reflection and healing, where nature and spiritual landmarks come together along the path."] },
            { h: "Comprehensive Planning Framework", lines: ["Through a master plan, we established a clear framework for routes, content, and operations. By strengthening connectivity, wayfinding, and program development, we create a sustainable trail that supports both cultural value and regional tourism."] },
          ],
        },
      ],
    },
    culture: {
      title: "Walking-Based Cultural Programs",
      tabs: [
        {
          name: "Youth Travel & Culture School",
          blocks: [
            { h: "Youth Travel & Culture School", lines: ["A program designed to help young people explore history, culture, and nature through walking journeys—creating meaningful memories, building emotional connections, and inspiring them to envision and shape their future."] },
            { h: "", lines: ["Launched in 2010 with support from the Ministry of Culture, Sports and Tourism, the program has continued since 2017 as an independent social contribution initiative by Korea Trails & Culture. To date, over 2,000 mentors and mentees have walked together."] },
          ],
        },
        {
          name: "A Journey Stays With You",
          blocks: [
            { h: "", lines: ["Even along familiar paths and in places you've been before, we offer immersive, locally rooted experiences through a fresh perspective. A journey that leaves lasting moments—ones that stay with you long after the walk."] },
            { h: "", lines: ["A trail is more than a way to get from one place to another. It is where time and life unfold—where experiences become memories, and places are shaped by the stories of people. By walking these paths, we connect with people and their stories—creating journeys that truly last."] },
          ],
        },
        {
          name: "Trail Companion Program",
          blocks: [
            { h: "Walking Together, Every Step Stronger", lines: ["We believe the people you walk with can transform the journey itself. Even on the same path, shared steps feel lighter—and stay with you longer. With a trusted companion by your side, stories unfold along the way, combining interpretation and experience to deepen your understanding of the trail."] },
            { h: "", lines: ["Walking together makes the journey easier, more joyful, and more connected—where people and paths naturally come together, and every step becomes a lasting memory."] },
          ],
        },
        {
          name: "Walking Festival",
          blocks: [
            { h: "Participatory Walking Festival", lines: ["We create interactive walking festivals where local stories and culture come to life along the trail. Beyond a one-time event, each festival helps foster a lasting walking culture and deeper connections with local communities."] },
            { h: "", lines: ["As participants walk along the path, local content unfolds in a connected flow—immersing them in the character of each place and offering fresh perspectives on both trail and region. With every step, new experiences emerge, bringing people and places together in a shared celebration."] },
          ],
        },
        {
          name: "Archiving",
          blocks: [
            { h: "Trail & Local Cultural Assetization", lines: ["We collect and document the histories, cultures, and stories embedded along each trail—transforming them into structured content and data. This archive preserves the identity of the trail while expanding into diverse programs and experiences."] },
            { h: "", lines: ["Through field research and storytelling, we translate local narratives into formats such as video, text, and maps—making them accessible across publications, programs, and digital platforms."] },
          ],
        },
      ],
    },
    goods: {
      title: "Goods Design & Retail",
      tabs: [
        {
          name: "Haeparang-gil Stamp Book",
          blocks: [
            { h: "Haeparang-gil Stamp Book", lines: ["A travel companion that invites you to experience the East Coast trail from a new perspective. As you walk, each stamp you collect captures your journey—adding small moments of joy and motivation along the way."] },
            { h: "", lines: ["Divided into two volumes, it reflects the character of each region: Gangwon's scenic, nature-rich coastline, and Gyeongsang's shores shaped by towns and everyday life."] },
          ],
        },
        {
          name: "Korea Dulle-gil Keyring",
          blocks: [
            { h: "An Object Inspired by the Flow and Connection of the Trail", lines: ["Based on the official logo and graphic elements, it intuitively expresses the structure and direction of connected paths."] },
            { h: "", lines: ["Its compact yet distinctive form reflects the identity of the Korea Dulle-gil, carrying the memory of the trail into everyday life. More than a souvenir, it is a symbolic object that clearly embodies the system and meaning of the trail—subtly yet distinctly representing the path."] },
          ],
        },
        {
          name: "Haeroji Keyring",
          blocks: [
            { h: "A Small Companion for the Journey", lines: ["A friendly character that captures the joy of walking and the spirit of the Korea Dulle-gil—bringing the trail into everyday life. Simply carrying it with you can spark the desire to walk again."] },
          ],
        },
      ],
    },
  },
  ourStories: {
    hero: {
      title: "Stories and Updates",
      lines: ["By sharing our stories,", "we make the journey even richer."],
    },
  },
  walkWithUs: {
    hero: {
      title: "Support our work",
      desc: "Join the journey. Bring value to the path.",
    },
    tabs: { donation: "Donation", annual: "Annual Fund and Activity Report" },
    donation: {
      headline: "Your support keeps the trail alive and shining.",
      desc: ["Please support the sustainable development of walking trails. Your donation is used to support a wide range of activities that ensure their long-term sustainability."],
      account: "Account",
      accountNo: "NH Bank 301-0061-8049-01",
      holder: "Holder",
      holderName: "Korea Trails and Culture Foundation",
      note: "One-time or recurring donations available.",
      usageTitle: "Your donations are used for",
      usage: ["Developing & maintaining walking trails", "Running educational & cultural programs", "Supporting volunteer operations"],
      copyAria: "Copy account number",
      copied: "Copied",
    },
    annual: { sampleTitle: "Title of the content" },
  },
  walkingTogether: {
    hero: {
      title: "Network",
      lines: ["Walking together to make every trail", "and connection meaningful."],
    },
    peel: ["We walk together to create", "beautiful trails and to make each step", "more meaningful through connection."],
    learnMore: "Learn More",
    orgs: [
      {
        title: "Korean Trail Association (KTA)",
        lines: [
          "Korean Trail Association (KTA) is a network of organizations dedicated to the operation and management of walking trails across Korea. Through walking, KTA helps people connect with nature, rediscover local culture, and promotes sustainable tourism and community development. Together with around 20 trail organizations—including the Korean Trails and Culture Foundation (KTNC)—it is building a sustainable walking culture.",
        ],
      },
      {
        title: "Asia Trails Network (ATN)",
        lines: [
          "A regional network connecting trails across Asia, fostering exchange and collaboration between countries while strengthening the diversity and connectivity of Asian trails. In partnership with ATN, the Korea Trails & Culture Foundation positions Korea's trails within a broader Asian context—connecting them to the region through shared programs and initiatives.",
        ],
      },
      {
        title: "The World Trails Network (WTN)",
        lines: [
          "The World Trails Network (WTN) is a global collaborative network that connects trails and walking routes around the world. It brings together trail organizations from different countries to share knowledge and advance the conservation, sustainable use, and value of walking tourism. Through its partnership with WTN, Korea Trails and Culture Foundation connects Korea's trails to the world—expanding its experiences and content on a global scale. Together, we are shaping a global movement that links people, nature, and communities through trails.",
        ],
      },
      {
        title: "Great Kodullers Club (GKO)",
        lines: [
          "GKO (Korea Dulle-gil Completion Club) is a community of individuals who have completed at least one of the Korea Dulle-gil trails—Haeparang Trail, Namparang Trail, Seohaerang Trail, or the DMZ Peace Trail. Established in May 2024, the club aims to promote a sustainable walking travel culture. Its members—including those who have achieved the 4,500 km “Grand Slam” by completing the entire network—actively share information and go beyond simple walking activities to lead events and promotional activities related to the Korea Dulle-gil.",
        ],
      },
    ],
  },
  header: {
    home: "Korean Trails & Culture Home",
    language: "Change language",
    nav: {
      ourWay: "Our Path",
      sameTrail: "Same trail, New Vision",
      thePathWeWalk: "The Path we Walk",
      walkingTogether: "Walking Together",
      ourStories: "Our Stories",
      walkWithUs: "Walk with Us",
    },
  },
  footer: {
    foundation: "Korean Trails and Culture Foundation",
    cols: [
      { h: "Our Path", links: ["Mission", "Vision & Core Values", "History", "People", "Directions"] },
      { h: "Same trail, New Vision", links: ["Expertise"] },
      { h: "The Path we Walk", links: ["Korea Dulle-gil", "Regional Trail Research & Planning", "Walking Culture Programs", "Goods Development & Sales"] },
      { h: "Walking Together", links: ["Korea Trails Alliance", "ATN", "WTN", "Korea Dulle-gil Finishers Club"] },
      { h: "Our Stories", links: ["Notices", "Subscribe", "Contact"] },
      { h: "Walk with Us", links: ["Donate", "Annual Funds & Activity Report"] },
    ],
    info: {
      line1: ["CEO: Hong Seong-un", "Business Reg. No.: 123-82-14123"],
      line2: [
        "Address: 25-8, Hangang-daero 52-gil, Yongsan-gu, Seoul, DB Tower #402",
        "Tel: 02-6013-6610",
        "Email: ktnc@tnc.or.kr",
      ],
      line3: ["Privacy Officer: Choi Hae-seon"],
    },
    // 모바일 푸터 전용 영문 줄 구성 (사용자 지정 — 5줄, 줄간격 12px)
    mobileInfo: [
      "CEO : Seongwoon Hong",
      "Business Registration No. : 123-82-14123",
      "Address : #402, DB Tower, 25-8 Hangang-daero 52-gil, Yongsan-gu, Seoul, Korea",
      "Tel : +82-2-6013-6610  Email : ktnc@tnc.or.kr",
      "Privacy Officer : Haeseon Choi",
    ],
  },
  notices: {
    tabs: {
      notices: "Announcements",
      subscribe: "Subscribe",
      comingSoon: "추가될 메뉴",
      contact: "Contact us",
    },
    search: "Search",
    noticesHeading: ["Discover the latest from Korea Trails & Culture."],
    comingSoonHeading: ["A new board", "is coming soon."],
    sampleTitle: "Title of the content",
    sampleBody:
      "Displays up to two lines of the post text. Displays up to two lines of the post text. Displays up to two lines of the post text. Displays up to two lines of the post tex...",
    sampleDate: "2026.03",
    placeholderTitle: "Post Title",
    placeholderBody:
      "Up to two lines of the post body are shown here. Up to two lines of the post body are shown here. Up to two lines of the post body are shown here.",
  },
  subscribe: {
    heading: ["Stay updated with Korea Trails & Culture."],
    labels: { name: "Full Name", phone: "Contact Number", email: "E-mail", interests: "Interests" },
    interests: ["Trail Rangers", "Volunteer", "Walking programs"],
    emailDirect: "Direct input",
    namePlaceholder: "John Doe",
    emailPlaceholder: "Email",
    consent: "I accept the Privacy Policy.",
    submit: "Subscribe",
    cards: [
      { title: "Trail Rangers", lines: ["Every year, our Trail Rangers regularly manage designated sections to ensure a safe and comfortable journey for all travelers."] },
      { title: "Volunteer", lines: ["We host volunteer programs for trail maintenance. Activities run flexibly and include weeding, trail upkeep, and plogging to protect our paths."] },
      { title: "Walking Programs", lines: ["We run local programs like ‘Trail Culture School’ and youth tours like ‘Youth Travel Culture School.’ Open to individuals and groups."] },
    ],
  },
  inquiry: {
    heading: ["Please leave your inquiries here.", "We will respond to you as soon as possible."],
    labels: { name: "Full Name", email: "E-mail", content: "Question / Inquiries" },
    emailDirect: "Direct input",
    namePlaceholder: "John Doe",
    emailPlaceholder: "Email",
    contentPlaceholder: "Please enter your inquiry.",
    submit: "Send",
  },
  noticeDetail: {
    list: "List",
    prev: "Previous post",
    next: "Next post",
    title: "Recruiting Korea Dulle-gil Keepers",
    date: "2026.03",
    body: `[2026 Korea Dulle-gil Keepers Recruitment]

Hello. The Korea Tourism Organization is recruiting "Korea Dulle-gil Keepers" to help ensure the safety and convenience of the Korea Dulle-gil in 2026.

Please check the Durunubi notices for applications and details.
We look forward to the interest and participation of those who will help manage the Korea Dulle-gil, the longest walking trail in Korea that connects the outer edges of our land.`,
    posterAlt: "2026 Korea Dulle-gil Keepers Recruitment Poster",
  },
};

export const dictionaries = { ko, en };

export type Dictionary = typeof ko;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
