import gsap from "gsap/gsap-core";

class HoverButton {
    constructor(el) {

      this.el = el;
      this.hover = false;
      this.calculatePosition();
      this.attachEventsListener();
      this.boundMove = this.onMouseMove.bind(this);
      this.boundResize = this.calculatePosition.bind(this);

      window.addEventListener('mousemove', this.boundMove );
      window.addEventListener('resize', this.boundResize);
      window.addEventListener('scroll', this.boundResize);
    }
    
    attachEventsListener() {
      // console.log(this, this.boundMove);
    }
    
    calculatePosition() {
      gsap.set(this.el, {
        x: 0,
        y: 0,
        scale: 1
      });
      const box = this.el.getBoundingClientRect();
      this.x = box.left + (box.width * 0.5);
      this.y = box.top + (box.height * 0.5);
      this.width = box.width;
      this.height = box.height;
    }
    
    onMouseMove(e) {
      let hover = false;
      let hoverArea = (this.hover ? 0.7 : 0.5);
      let x = e.clientX - this.x;
      let y = e.clientY - this.y;
      let distance = Math.sqrt( x*x + y*y );
      if (distance < (this.width * hoverArea)) {
         hover = true;
          if (!this.hover) {
            this.hover = true;
          }
          this.onHover(e.clientX, e.clientY);
      }
      
      if(!hover && this.hover) {
        this.onLeave();
        this.hover = false;
      }
    }
    
    onHover(x, y) {
      gsap.to(this.el,  {
        x: (x - this.x) * 0.4,
        y: (y - this.y) * 0.4,
        scale: 1.15,
        ease: 'power2.out',
        duration: 0.4
      });
      this.el.style.zIndex = 10;
    }
    onLeave() {
      gsap.to(this.el, {
        x: 0,
        y: 0,
        scale: 1,
        ease: 'sine.out',
        duration: 0.7
      });
      this.el.style.zIndex = 1;
    }
    // handleMove(e) {
    //   console.log('hover:over');
    //   this.onMouseMove(e)
    // }
    // handleResize() {
    //   this.calculatePosition()
    // }
    destroy() {

      this.el = null;
      window.removeEventListener('mousemove', this.boundMove);
      window.removeEventListener('resize', this.boundResize );
      window.removeEventListener('scroll', this.boundResize );
    }
  }

  export default HoverButton;