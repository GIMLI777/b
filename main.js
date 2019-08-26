// phina.js ���O���[�o���̈�ɓW�J
phina.globalize();
 
// �t�@�C���ǂݍ���
var ASSETS = {
  //�摜
  image: {
    bg: 'img/bg.jpg',
    bg2: 'img/bg.jpg',
    egg: 'img/egg.jpg',
    tomapiko: 'https://rawgit.com/phi-jp/phina.js/develop/assets/images/tomapiko_ss.png'
  },
  //�t���[���A�j���[�V�������
  spritesheet: {
    'tomapiko_ss': 'https://rawgit.com/phi-jp/phina.js/develop/assets/tmss/tomapiko.tmss',
  },
};
// �萔
var SCREEN_WIDTH = 465;  // �X�N���[����
var SCREEN_HEIGHT = 465;  // �X�N���[������
var JUMP_POWOR = 10; // �W�����v��
var GRAVITY = 0.5; // �d��
var JUMP_FLG = false; // �W�����v�����ǂ���
var EGG_ATACK = 5; //���̈ړ����x
var EGG_DIE = false; //��������Ă邩�ǂ���
var HIT_RADIUS     = 16;  // �����蔻��p�̔��a
var SCORE = 0; // �X�R�A
 
/*
 * ���C���V�[��
 */
phina.define("MainScene", {
  // �p��
  superClass: 'DisplayScene',
 
  // ������
  init: function(options) {
    // super init
    this.superInit(options);
 
    //1��ڂ̏�����
    SCORE = 0;
    EGG_ATACK = 5;
    EGG_DIE = false;
    JUMP_FLG = false;
 
    // �w�i
    this.bg = Sprite("bg").addChildTo(this);
    this.bg.origin.set(0, 0); // �����ɕύX
    // ���[�v�p�̔w�i
    this.bg2 = Sprite("bg2").addChildTo(this);
    this.bg2.origin.set(0, 0); // �����ɕύX
    this.bg2.setPosition(SCREEN_WIDTH, 0);
 
    //�X�R�A�\��
    this.scoreLabel = Label('SCORE:'+SCORE).addChildTo(this);
    this.scoreLabel.x = this.gridX.center();
    this.scoreLabel.y = this.gridY.span(4);
    this.scoreLabel.fill = 'gray';
 
    // ��Q���i���j
    this.egg = Sprite('egg', 48, 48).addChildTo(this);
    this.egg.setPosition(SCREEN_WIDTH, 310);
    this.egg.frameIndex = 0;
 
    // �v���C���[
    var player = Player('tomapiko').addChildTo(this);
    player.setPosition(100, 300);
    this.player = player;
 
    // ��ʃ^�b�`������
    this.onpointend = function() {
      if(JUMP_FLG == false) {
        JUMP_FLG = true;
        player.anim.gotoAndPlay('fly');
        player.scaleX *= -1;
        player.physical.velocity.y = -JUMP_POWOR;
        player.physical.gravity.y = GRAVITY;
      }
    }
  },
 
  // �X�V
  update: function(app) {
 
    //�w�i�摜�̈ړ�
    this.bg.x -= 1;
    this.bg2.x -= 1;
    if(this.bg.x <= -SCREEN_WIDTH) {
      this.bg.x = 0;
      this.bg2.x = SCREEN_WIDTH;
    }
 
    //�v���C���[�̃A�j���[�V����
    var player = this.player;
    if(player.y > 310) {  //�n�ʂɒ��n��
      player.y = 300;
      JUMP_FLG = false;
      player.anim.gotoAndPlay('right');
      player.scaleX *= -1;
      player.physical.velocity.y = 0;
      player.physical.gravity.y = 0;
    }
 
    //���̃A�j��
    var egg = this.egg;
    if(EGG_DIE == false){
      egg.rotation -= EGG_ATACK;
      if(egg.x < 0){
        egg.x = SCREEN_WIDTH+100;
        SCORE += 100;
        EGG_ATACK += 2;
        this.scoreLabel.text = 'SCORE:'+SCORE;
      }
    } else {
      egg.rotation = 0;
      if(egg.x < 0){
        this.exit({
          score: SCORE,
        });
      }
    }
    egg.x -= EGG_ATACK;
    // ���ƃv���C���[�̕ӂ蔻��
    this.hitTestEnemyPlayer();
  },
  hitTestEnemyPlayer: function() {
    var player = this.player;
    var egg = this.egg;
 
    // ����p�̉~
    var c1 = Circle(player.x, player.y, HIT_RADIUS);
    var c2 = Circle(egg.x, egg.y, HIT_RADIUS);
    // �~����
    if (Collision.testCircleCircle(c1, c2)) {
      EGG_DIE = true;
      egg.frameIndex = 1;
      egg.scaleY = egg.scaleX = 1.1;
      player.x = egg.x-30;
      player.anim.gotoAndPlay('damage');
    }
  }
});
 
/*
 * �v���C���[�N���X
 */
phina.define('Player', {
  superClass: 'Sprite',
  // �R���X�g���N�^
  init: function(image) {
    // �e�N���X������
    this.superInit(image);
    // �t���[���A�j���[�V�������A�^�b�`
    this.anim = FrameAnimation('tomapiko_ss').attachTo(this);
    // �����A�j���[�V�����w��
    this.anim.gotoAndPlay('right');
  },
  // ���t���[������
  update: function() {
  },
});
 
/*
 * ���C������
 */
phina.main(function() {
  // �A�v���P�[�V�����𐶐�
  var app = GameApp({
    title: 'START',
    startLabel: 'title',   // TitleScene ����J�n
    width: SCREEN_WIDTH,  // ��ʕ�
    height: SCREEN_HEIGHT,// ��ʍ���
    assets: ASSETS,       // �A�Z�b�g�ǂݍ���
  });
 
  // ���s
  app.run();
});