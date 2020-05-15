import { Component, Input, OnInit } from '@angular/core';
import { Events, NavController } from 'ionic-angular';
// Providers
import { AppProvider, IABCardProvider } from '../../../../providers';

// Pages
import { animate, style, transition, trigger } from '@angular/animations';
import { BitPayCardPage } from '../bitpay-card';
import { BitPayCardIntroPage } from '../bitpay-card-intro/bitpay-card-intro';
import { PhaseOneCardIntro } from '../bitpay-card-phases/phase-one/phase-one-intro-page/phase-one-intro-page';

@Component({
  selector: 'bitpay-card-home',
  templateUrl: 'bitpay-card-home.html',
  animations: [
    trigger('fadeUp', [
      transition(':enter', [
        style({
          transform: 'translateY(5px)',
          opacity: 0
        }),
        animate('300ms')
      ])
    ]),
    trigger('fade', [
      transition(':enter', [
        style({
          opacity: 0
        }),
        animate('300ms')
      ])
    ]),
    trigger('tileSlideIn', [
      transition(':enter', [
        style({
          transform: 'translateX(10px)',
          opacity: 0
        }),
        animate('300ms ease')
      ])
    ])
  ]
})
export class BitPayCardHome implements OnInit {
  public appName: string;
  public disableAddCard = true;
  public isFetching: boolean;
  public ready: boolean;

  @Input() showBitpayCardGetStarted: boolean;
  @Input() bitpayCardItems: any;
  @Input() cardExperimentEnabled: boolean;
  @Input() waitList: boolean;
  @Input() hasCards: boolean;
  @Input() initialized: boolean;

  constructor(
    private appProvider: AppProvider,
    private navCtrl: NavController,
    private iabCardProvider: IABCardProvider,
    private events: Events
  ) {
    this.events.subscribe('reachedCardLimit', () => {
      this.disableAddCard = true;
    });
    this.events.subscribe('isFetchingDebitCards', status => {
      this.isFetching = status;
    });
  }

  ngOnInit() {
    this.appName = this.appProvider.info.userVisibleName;
    setTimeout(() => {
      this.ready = true;
      this.disableAddCard =
        this.bitpayCardItems &&
        this.bitpayCardItems.find(c => c.provider === 'galileo');
    }, 200);
  }

  public goToBitPayCardIntroPage() {
    this.navCtrl.push(
      this.cardExperimentEnabled
        ? this.waitList
          ? PhaseOneCardIntro
          : BitPayCardIntroPage
        : PhaseOneCardIntro
    );
  }

  public trackBy(index) {
    return index;
  }

  public goToCard(cardId): void {
    if (this.cardExperimentEnabled) {
      const message = `loadDashboard?${cardId}`;
      this.iabCardProvider.show();
      this.iabCardProvider.sendMessage(
        {
          message
        },
        () => {}
      );
    } else {
      this.navCtrl.push(BitPayCardPage, { id: cardId });
    }
  }
}
